from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.audit_logs import AuditLog
from app.enums.audit_logs import ActionTypes


def create_audit_log(
    db: Session,
    user_id,
    entity_id,
    entity_type,
    action: ActionTypes,
    changed_fields = [],
):
    try:

        log = AuditLog(
            user_id = user_id,
            entity_id = str(entity_id),
            entity_type = entity_type,
            action = action,
            changed_fields = changed_fields,
        )
        db.add(log)

        return log
    
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to upload file")
