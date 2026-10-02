from sqlalchemy.orm import Session, joinedload

from app.models.user import User


def get_user_data(db: Session, *filters, first: bool = True):

    query = db.query(User).options(
        joinedload(User.student),
        joinedload(User.staff),
    )

    if filters:
        for f in filters:
            query = query.filter(f)
    
    if first:
        return query.first()
    return query.all()