from sqlalchemy.orm import Session, selectinload
from fastapi import UploadFile, HTTPException
from typing import List, Optional

from app.models.file_attachment import FileAttachment
from app.models.file import File
from app.utils.file_upload import upload_files
from app.utils.delete_file import delete_files


async def add_files(
    db: Session,
    uploaded_by: str,
    entity_id: str,
    entity_type: str,
    files: List[UploadFile],
    purpose: str,
    display_order: Optional[List[str]] = None,
) -> tuple[list[File], list[FileAttachment]]:
    
    saved_paths = []

    try:
        if display_order and len(files) != len(display_order):
            raise HTTPException(status_code=400, detail="Files and display_order length mismatch")

        saved_files = await upload_files(folder_name=entity_type, files=files, positions=display_order)

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
                purpose=purpose,
                display_order=sf["position"],
            )
            for db_file, sf in zip(db_files, saved_files)
        ]
        db.add_all(db_attachments)

        return db_files, db_attachments
        
    except HTTPException:
        delete_files(saved_paths)
        raise
    except Exception:
        delete_files(saved_paths)
        raise HTTPException(status_code=500, detail="Failed to upload file")


def remove_files(
    db: Session,
    attachment_ids: List[str],
) -> dict:

    deleted_paths: list[str] = []
    deleted_attachment_ids: list[str] = []
    
    try:
        db_attachments = (
            db.query(FileAttachment)
            .options(selectinload(FileAttachment.file))
            .filter(FileAttachment.id.in_(attachment_ids))
            .all()
        )
        
        if not db_attachments:
            return {
                "deleted_attachments_count": 0,
                "deleted_files_count": 0,
                "deleted_paths": []
            }
        
        deleted_attachment_ids = [att.id for att in db_attachments]
        file_ids = {att.file_id for att in db_attachments}
        
        db_files = (
            db.query(File)
            .options(selectinload(File.attachments))
            .filter(File.id.in_(file_ids))
            .all()
        )
        
        for attachment in db_attachments:
            db.delete(attachment)
        
        deleted_attachment_ids_set = set(deleted_attachment_ids)
        for db_file in db_files:
            has_remaining_attachments = any(
                att.id not in deleted_attachment_ids_set
                for att in db_file.attachments
            )
            
            if not has_remaining_attachments:
                deleted_paths.append(db_file.file_path)
                db.delete(db_file)
        
        if deleted_paths:
            delete_files(deleted_paths)

        return {
            "deleted_attachments_count": len(deleted_attachment_ids),
            "deleted_files_count": len(deleted_paths),
            "deleted_paths": deleted_paths
        }
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to delete files")

