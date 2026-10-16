from sqlalchemy.orm import Session, selectinload
from fastapi import UploadFile, HTTPException
from typing import List, Optional

from app.models.file_attachment import FileAttachment
from app.models.file import File
from app.utils.file_upload import upload_files
from app.utils.delete_file import delete_files


async def create_files(
    db: Session,
    uploaded_by: str,
    entity_id: str,
    entity_type: str,
    files: List[UploadFile],
    purpose: Optional[List[str]] = None,
) -> tuple[list[File], list[FileAttachment]]:
    
    saved_paths = []

    try:
        if purpose and len(files) != len(purpose):
            raise HTTPException(status_code=400, detail="Files and purpose length mismatch")

        saved_files = await upload_files(folder_name=entity_type, files=files, positions=purpose)

        saved_paths = [sf["url"] for sf in saved_files]

        db_files = [
            File(
                uploaded_by=uploaded_by,
                file_path=saved_file["url"],
                extension=saved_file["file_ext"],
                size_bytes=saved_file["size"],
            )
            for saved_file in saved_files
        ]
        db.add_all(db_files)
        db.flush()

        db_attachments = [
            FileAttachment(
                file_id=db_file.id,
                entity_id=entity_id,
                entity_type=entity_type,
                purpose=sf["position"] or "general",
            )
            for db_file, sf in zip(db_files, saved_files)
        ]
        db.add_all(db_attachments)

        db.commit()
        
        return db_files, db_attachments
        
    except HTTPException:
        db.rollback()
        delete_files(saved_paths)
        raise
    except Exception:
        db.rollback()
        delete_files(saved_paths)
        raise HTTPException(status_code=500, detail="Failed to upload file")

    
def delete_files(
    db: Session,
    attachment_ids: list[str]
) -> bool:

    if not attachment_ids:
        return False

    try:
        attachment_ids_set = set(attachment_ids)
        if not attachment_ids_set:
            return False

        db_attachments = (
            db.query(FileAttachment)
            .filter(FileAttachment.id.in_(attachment_ids_set))
            .all()
        )

        file_ids = {att.file_id for att in db_attachments}

        db_files = (
            db.query(File)
            .options(selectinload(File.attachments))
            .filter(File.id.in_(file_ids))
            .all()
        )

        files_to_delete_from_disk = []

        for db_file in db_files:

            has_remaining_attachments = any(
                att.id not in attachment_ids_set
                for att in db_file.attachments
            )

            if not has_remaining_attachments:
                files_to_delete_from_disk.append(db_file.file_path)
                db.delete(db_file)

        db.commit()

        delete_files(files_to_delete_from_disk)

        return True

    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete files")
