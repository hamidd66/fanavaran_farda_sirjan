import asyncio
import hashlib
import logging

from pathlib import PurePosixPath
from typing import List, Optional, Union
from uuid import UUID

from fastapi import UploadFile, HTTPException
from sqlalchemy import func, text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.enums.file import EntityType, FilePurpose, StorageProvider, StorageType, FileCategory
from app.models.file import File
from app.models.file_attachment import FileAttachment
from app.utils.delete_file import delete_files
from app.utils.file_upload import upload_files


logger = logging.getLogger(__name__)

MAX_ATTACHMENTS = 50
MAX_REMOVE = 200
MAX_DISPLAY_ORDER = 1_000_000
HASH_CHUNK_SIZE = 1024 * 1024

CHECKSUM_ALGORITHM = "sha256"

MIME_BY_EXT = {
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "png": "image/png",
    "webp": "image/webp",
    "heic": "image/heic",
    "heif": "image/heif",
    "avif": "image/avif",
}

PENDING_UPLOADS_KEY = "_pending_file_uploads"


def _is_int(value) -> bool:
    return isinstance(value, int) and not isinstance(value, bool)

def _to_dict(item) -> dict:
    if isinstance(item, dict):
        return item

    if hasattr(item, "model_dump"):
        return item.model_dump()

    if hasattr(item, "dict"):
        return item.dict()

    raise HTTPException(status_code=400, detail="Invalid attachment")

def _parse_enum(enum_cls, value, name: str):
    try:
        return enum_cls(value)
    except (ValueError, TypeError):
        allowed = ", ".join(item.value for item in enum_cls)
        raise HTTPException(
            status_code=400,
            detail=f"Invalid {name}. Allowed values: {allowed}",
        )

def _parse_attachments(attachments, files_count: int) -> List[dict]:

    if isinstance(attachments, dict):
        attachments = attachments.get("items")

    if not isinstance(attachments, (list, tuple)) or not attachments:
        raise HTTPException(status_code=400, detail="At least one attachment is required")

    if len(attachments) > MAX_ATTACHMENTS:
        raise HTTPException(
            status_code=400,
            detail=f"Maximum {MAX_ATTACHMENTS} attachments allowed",
        )

    parsed = []
    used_indexes = set()
    used_orders = set()
    used_file_purposes = set()
    primary_purposes = set()

    for raw in attachments:
        item = _to_dict(raw)

        file_index = item.get("file_index")
        if not _is_int(file_index) or not 0 <= file_index < files_count:
            raise HTTPException(status_code=400, detail="Invalid file_index")

        purpose = _parse_enum(FilePurpose, item.get("purpose"), "purpose")

        display_order = item.get("display_order")
        if not _is_int(display_order) or not 0 <= display_order <= MAX_DISPLAY_ORDER:
            raise HTTPException(status_code=400, detail="Invalid display_order")

        is_primary = item.get("is_primary", False)
        is_active = item.get("is_active", True)

        if not isinstance(is_primary, bool) or not isinstance(is_active, bool):
            raise HTTPException(status_code=400, detail="is_primary and is_active must be boolean")

        if is_primary and not is_active:
            raise HTTPException(status_code=400, detail="Primary attachment must be active")

        if (purpose, display_order) in used_orders:
            raise HTTPException(status_code=400, detail="Duplicate display_order for the same purpose")

        if (purpose, file_index) in used_file_purposes:
            raise HTTPException(status_code=400, detail="Same file attached twice for the same purpose")

        if is_primary:
            if purpose in primary_purposes:
                raise HTTPException(status_code=400, detail="Only one primary attachment per purpose is allowed")
            primary_purposes.add(purpose)

        used_orders.add((purpose, display_order))
        used_file_purposes.add((purpose, file_index))
        used_indexes.add(file_index)

        parsed.append({
            "file_index": file_index,
            "purpose": purpose,
            "display_order": display_order,
            "is_primary": is_primary,
            "is_active": is_active,
        })

    if used_indexes != set(range(files_count)):
        raise HTTPException(status_code=400, detail="Every file must have at least one attachment")

    return parsed

def _sha256(path: str) -> str:
    digest = hashlib.sha256()

    with open(path, "rb") as file:
        while chunk := file.read(HASH_CHUNK_SIZE):
            digest.update(chunk)

    return digest.hexdigest()

async def _run_blocking(func_, *args):
    task = asyncio.create_task(asyncio.to_thread(func_, *args))

    try:
        return await asyncio.shield(task)
    except asyncio.CancelledError:
        await asyncio.gather(task, return_exceptions=True)
        raise

def _clean_original_name(filename: Optional[str], fallback: str) -> str:
    name = PurePosixPath((filename or "").replace("\\", "/")).name
    name = "".join(char for char in name if char.isprintable()).strip()[:255].strip()
    return name or fallback

def _lock(db: Session, key: str) -> None:
    db.execute(
        text("SELECT pg_advisory_xact_lock(hashtext(:key))"),
        {"key": key},
    )

def _attachment_lock_key(entity_type: EntityType, entity_id: UUID, purpose: FilePurpose) -> str:
    return f"file_att:{entity_type.value}:{entity_id}:{purpose.value}"

def _check_conflicts(
    db: Session,
    entity_id: UUID,
    entity_type: EntityType,
    parsed: List[dict],
) -> set:

    purposes = list({item["purpose"] for item in parsed})

    rows = (
        db.query(
            FileAttachment.purpose,
            FileAttachment.display_order,
            FileAttachment.file_id,
            FileAttachment.is_primary,
            FileAttachment.is_active,
            FileAttachment.deleted_at,
        )
        .filter(
            FileAttachment.entity_id == entity_id,
            FileAttachment.entity_type == entity_type,
            FileAttachment.purpose.in_(purposes),
        )
        .all()
    )

    used_orders = {(row.purpose, row.display_order) for row in rows}

    used_primaries = {
        row.purpose
        for row in rows
        if row.is_primary and row.is_active and row.deleted_at is None
    }

    alive_pairs = {
        (row.purpose, row.file_id)
        for row in rows
        if row.deleted_at is None
    }

    for item in parsed:
        if (item["purpose"], item["display_order"]) in used_orders:
            raise HTTPException(status_code=409, detail="display_order is already in use")

        if item["is_primary"] and item["purpose"] in used_primaries:
            raise HTTPException(status_code=409, detail="A primary attachment already exists for this purpose")

    return alive_pairs

def cleanup_pending_uploads(db: Session) -> None:

    paths = db.info.pop(PENDING_UPLOADS_KEY, [])

    if paths:
        delete_files(paths)

def confirm_pending_uploads(db: Session) -> None:

    db.info.pop(PENDING_UPLOADS_KEY, None)


async def add_files(
    db: Session,
    uploaded_by: UUID,
    entity_id: UUID,
    entity_type: Union[str, EntityType],
    folder_name: str,
    files: List[UploadFile],
    attachments: list,
    is_public: bool = True,
) -> tuple[list[File], list[FileAttachment]]:

    saved_paths: List[str] = []

    try:
        if not files:
            raise HTTPException(status_code=400, detail="At least one file is required")

        if not isinstance(is_public, bool):
            raise HTTPException(status_code=400, detail="is_public must be boolean")

        entity_type = _parse_enum(EntityType, entity_type, "entity_type")
        parsed = _parse_attachments(attachments, len(files))

        purposes = sorted({item["purpose"] for item in parsed}, key=lambda p: p.value)


        await _run_blocking(_check_conflicts, db, entity_id, entity_type, parsed)


        uploaded = await upload_files(folder_name=folder_name, files=files)

        saved_paths = [item["path"] for item in uploaded]


        checksums: List[str] = []

        for item in uploaded:
            checksums.append(await _run_blocking(_sha256, item["path"]))


        def _persist():
            for purpose in purposes:
                _lock(db, _attachment_lock_key(entity_type, entity_id, purpose))

            for checksum in sorted(set(checksums)):
                _lock(db, f"file_sum:{checksum}")

            alive_pairs = _check_conflicts(db, entity_id, entity_type, parsed)

            existing_files = (
                db.query(File)
                .filter(
                    File.checksum_algorithm == CHECKSUM_ALGORITHM,
                    File.checksum.in_(list(set(checksums))),
                    File.deleted_at.is_(None),
                )
                .order_by(File.id)
                .with_for_update()
                .all()
            )

            file_by_key = {
                (item.checksum, item.file_size): item
                for item in existing_files
            }

            db_files: List[File] = []
            new_files: List[File] = []
            duplicate_paths: List[str] = []

            for index, item in enumerate(uploaded):
                key = (checksums[index], item["size"])
                db_file = file_by_key.get(key)

                if db_file is not None:
                    duplicate_paths.append(item["path"])
                else:
                    stored_name = PurePosixPath(item["url"]).name
                    ext = item["file_ext"]

                    db_file = File(
                        uploaded_by=uploaded_by,
                        original_name=_clean_original_name(files[index].filename, stored_name),
                        stored_name=stored_name,
                        extension=ext,
                        mime_type=MIME_BY_EXT[ext],
                        file_size=item["size"],
                        storage_type=StorageType.disk,
                        storage_provider=StorageProvider.local,
                        bucket_name=None,
                        storage_path=f"{folder_name}/{stored_name}",
                        checksum=checksums[index],
                        checksum_algorithm=CHECKSUM_ALGORITHM,
                        category=FileCategory.image,
                        is_public=is_public,
                        is_active=True,
                    )
                    file_by_key[key] = db_file
                    new_files.append(db_file)

                db_files.append(db_file)

            seen_pairs = set()

            for item in parsed:
                db_file = db_files[item["file_index"]]
                pair = (item["purpose"], id(db_file))

                if pair in seen_pairs:
                    raise HTTPException(status_code=400, detail="Duplicate file in request")
                seen_pairs.add(pair)

                if db_file.id is not None and (item["purpose"], db_file.id) in alive_pairs:
                    raise HTTPException(status_code=409, detail="File is already attached for this purpose")

            db_attachments: List[FileAttachment] = []

            with db.begin_nested():
                db.add_all(new_files)
                db.flush()

                for item in parsed:
                    db_attachments.append(
                        FileAttachment(
                            file_id=db_files[item["file_index"]].id,
                            attached_by=uploaded_by,
                            entity_id=entity_id,
                            entity_type=entity_type,
                            purpose=item["purpose"],
                            display_order=item["display_order"],
                            is_primary=item["is_primary"],
                            is_active=item["is_active"],
                        )
                    )

                db.add_all(db_attachments)
                db.flush()

            return db_files, db_attachments, duplicate_paths

        db_files, db_attachments, duplicate_paths = await _run_blocking(_persist)

        delete_files(duplicate_paths)

        db.info.setdefault(PENDING_UPLOADS_KEY, []).extend(
            path for path in saved_paths if path not in duplicate_paths
        )

        return db_files, db_attachments

    except (HTTPException, asyncio.CancelledError):
        delete_files(saved_paths)
        raise

    except IntegrityError as exc:
        logger.warning("Integrity error while adding files", exc_info=True)
        delete_files(saved_paths)
        raise HTTPException(
            status_code=409,
            detail="Files could not be saved because of a conflict. Please try again.",
        ) from exc

    except Exception as exc:
        logger.exception("Failed to add files")
        delete_files(saved_paths)
        raise HTTPException(status_code=500, detail="Failed to upload file") from exc


def remove_files(
    db: Session,
    attachment_ids: List[UUID],
    entity_id: Optional[UUID] = None,
    entity_type: Optional[Union[str, EntityType]] = None,
) -> dict:

    empty = {
        "deleted_attachments_count": 0,
        "deleted_files_count": 0,
        "deleted_paths": [],
    }

    try:
        ids = set(attachment_ids or [])

        if not ids:
            return empty

        if len(ids) > MAX_REMOVE:
            raise HTTPException(status_code=400, detail=f"Maximum {MAX_REMOVE} attachments allowed")

        if entity_type is not None:
            entity_type = _parse_enum(EntityType, entity_type, "entity_type")

        def scoped(query):
            query = query.filter(FileAttachment.id.in_(ids))

            if entity_id is not None:
                query = query.filter(FileAttachment.entity_id == entity_id)

            if entity_type is not None:
                query = query.filter(FileAttachment.entity_type == entity_type)

            return query

        groups = scoped(
            db.query(
                FileAttachment.entity_type,
                FileAttachment.entity_id,
                FileAttachment.purpose,
            )
        ).distinct().all()

        lock_keys = sorted(
            _attachment_lock_key(row.entity_type, row.entity_id, row.purpose)
            for row in groups
        )

        for key in lock_keys:
            _lock(db, key)

        attachments = scoped(
            db.query(FileAttachment.id, FileAttachment.file_id)
        ).all()

        if not attachments:
            return empty

        attachment_ids_found = [row.id for row in attachments]
        file_ids = sorted({row.file_id for row in attachments})

        db_files = (
            db.query(File.id, File.storage_path, File.storage_provider)
            .filter(File.id.in_(file_ids))
            .order_by(File.id)
            .with_for_update()
            .all()
        )

        db.query(FileAttachment).filter(
            FileAttachment.id.in_(attachment_ids_found)
        ).delete(synchronize_session="fetch")

        remaining = dict(
            db.query(FileAttachment.file_id, func.count(FileAttachment.id))
            .filter(FileAttachment.file_id.in_(file_ids))
            .group_by(FileAttachment.file_id)
            .all()
        )

        orphan_files = [row for row in db_files if remaining.get(row.id, 0) == 0]

        if orphan_files:
            db.query(File).filter(
                File.id.in_([row.id for row in orphan_files])
            ).delete(synchronize_session="fetch")

        db.flush()

        return {
            "deleted_attachments_count": len(attachment_ids_found),
            "deleted_files_count": len(orphan_files),
            "deleted_paths": [
                row.storage_path
                for row in orphan_files
                if row.storage_provider == StorageProvider.local
            ],
        }

    except HTTPException:
        raise

    except Exception as exc:
        logger.exception("Failed to remove files")
        raise HTTPException(status_code=500, detail="Failed to delete files") from exc


def reorder_files(
    db: Session,
    entity_id: UUID,
    entity_type: Union[str, EntityType],
    purpose: Union[str, FilePurpose],
) -> int:
    try:
        entity_type = _parse_enum(EntityType, entity_type, "entity_type")
        purpose = _parse_enum(FilePurpose, purpose, "purpose")

        _lock(db, _attachment_lock_key(entity_type, entity_id, purpose))

        db_attachments = (
            db.query(FileAttachment)
            .filter(
                FileAttachment.entity_id == entity_id,
                FileAttachment.entity_type == entity_type,
                FileAttachment.purpose == purpose,
            )
            .order_by(
                FileAttachment.deleted_at.is_not(None),
                FileAttachment.display_order.asc(),
                FileAttachment.created_at.asc(),
                FileAttachment.id.asc(),
            )
            .all()
        )

        for index, attachment in enumerate(db_attachments, start=1):
            if attachment.display_order != index:
                attachment.display_order = index
                attachment.updated_at = func.clock_timestamp()

        db.flush()

        return sum(1 for item in db_attachments if item.deleted_at is None)

    except HTTPException:
        raise

    except Exception as exc:
        logger.exception("Failed to reorder files")
        raise HTTPException(status_code=500, detail="Failed to reorder files") from exc

