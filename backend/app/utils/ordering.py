from sqlalchemy import Boolean, Integer, func, inspect
from sqlalchemy.orm import Session
from typing import Any


def reorder_items(
    db: Session,                          # سشن دیتابیس
    model,                                # مدل SQLAlchemy
    order_field: str,                     # نام فیلد ترتیب (مثل display_order)
    group_field: str | None = None,       # نام فیلد گروه‌بندی (مثل course_id)
    group_value: Any = None,              # مقدار گروه (مثل UUID دوره)
    soft_delete_field: str | None = None, # نام فیلد حذف نرم (مثل is_deleted)
) -> int:                                 # تعداد آیتم‌های فعال مرتب‌شده

    mapper = inspect(model)

    columns = {
        column.key: column
        for column in mapper.columns
    }

    if order_field not in columns:
        raise ValueError(f"Invalid order field: {order_field}")

    order_column = columns[order_field]

    if not isinstance(order_column.type, Integer):
        raise ValueError("Order field must be an integer column")

    if (
        group_field is not None
        and group_field not in columns
    ):
        raise ValueError(f"Invalid group field: {group_field}")

    if soft_delete_field is not None:

        if soft_delete_field not in columns:
            raise ValueError(f"Invalid soft delete field: {soft_delete_field}")

        if not isinstance(
            columns[soft_delete_field].type,
            Boolean
        ):
            raise ValueError("Soft delete field must be boolean")

    db.flush()

    base_query = db.query(model)

    if group_field is not None:
        base_query = base_query.filter(
            columns[group_field] == group_value
        )

    if soft_delete_field is not None:

        deleted_query = base_query.filter(
            columns[soft_delete_field].is_(True)
        )

        deleted_items = (
            deleted_query
            .order_by(
                order_column.asc(),
                *[
                    pk.asc()
                    for pk in mapper.primary_key
                ]
            )
            .all()
        )

        if deleted_items:

            numbers = [
                getattr(item, order_field)
                for item in deleted_items
            ]

            if any(number is None for number in numbers):
                raise ValueError("Order field cannot contain NULL")

            min_number = min(
                deleted_query.with_entities(
                    func.min(order_column)
                ).scalar() or 0,
                0
            )

            for index, item in enumerate(deleted_items, start=1):
                setattr(item, order_field, min_number - index)

            db.flush()

            deleted_count = len(deleted_items)

            for index, item in enumerate(deleted_items):
                setattr(item, order_field, index - deleted_count)

            db.flush()

    active_query = base_query

    if soft_delete_field is not None:
        active_query = active_query.filter(
            columns[soft_delete_field].is_(False)
        )

    active_items = (
        active_query
        .order_by(
            order_column.asc(),
            *[
                pk.asc()
                for pk in mapper.primary_key
            ]
        )
        .all()
    )

    if not active_items:
        return 0

    numbers = [
        getattr(item, order_field)
        for item in active_items
    ]

    if any(number is None for number in numbers):
        raise ValueError("Order field cannot contain NULL")

    max_number = max(
        active_query.with_entities(
            func.max(order_column)
        ).scalar() or 0,
        0
    )

    for index, item in enumerate(active_items, start=1):
        setattr(item, order_field, max_number + index)

    db.flush()

    for index, item in enumerate(active_items, start=1):
        setattr(item, order_field, index)

    db.flush()

    return len(active_items)
