from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.db.session import get_db
from app.services.jwt_bearer import get_payload, get_optional_payload
from app.repositories.role_repo import get_active_roles


def require_roles(*allowed_roles: str, auth_optional: bool = False):
    async def check_permission(
        payload: dict | None = Depends(get_optional_payload if auth_optional else get_payload),
        db: Session = Depends(get_db),
    ) -> dict:

        if payload is None:
            return {
                "payload": None,
                "roles": [],
            }

        user_id = UUID(payload["sub"])

        active_roles = get_active_roles(db, user_id)

        if allowed_roles:
            has_permission = bool(
                set(active_roles).intersection(allowed_roles)
            )

            if not has_permission and not auth_optional:
                raise HTTPException(status_code=403, detail="Access denied")

        return {
            "payload": payload,
            "roles": active_roles,
        }

    return check_permission
