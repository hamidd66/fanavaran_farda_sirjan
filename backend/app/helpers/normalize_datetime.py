from datetime import datetime, timezone

def normalize_datetime(dt: datetime) -> datetime:

    if dt.tzinfo is None or dt.tzinfo.utcoffset(dt) is None:
        return dt.replace(tzinfo=timezone.utc)
    
    return dt.astimezone(timezone.utc)