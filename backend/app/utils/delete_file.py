import logging
from pathlib import Path
from typing import Iterable, Optional, Union

from app.utils.file_upload import UPLOAD_ROOT

logger = logging.getLogger(__name__)


def _resolve_upload_path(filename: Union[str, Path]) -> Optional[Path]:
    if not filename:
        return None

    raw_value = str(filename).replace("\\", "/")
    raw_path = Path(raw_value)

    if raw_value.startswith("/media/uploads/"):
        candidate = UPLOAD_ROOT / raw_value.removeprefix("/media/uploads/")
    elif raw_value.startswith("media/uploads/"):
        candidate = UPLOAD_ROOT / raw_value.removeprefix("media/uploads/")
    else:
        candidate = raw_path if raw_path.is_absolute() else UPLOAD_ROOT / raw_path
    candidate = candidate.resolve()
    root = UPLOAD_ROOT.resolve()

    if root not in candidate.parents:
        logger.error("Refusing to delete a path outside upload root: %s", candidate)
        return None

    return candidate


def delete_file(filename: Optional[Union[str, Path]]) -> bool:
    path = _resolve_upload_path(filename) if filename else None
    if path is None:
        return False

    try:
        if path.is_file():
            path.unlink()
            return True
        return False
    except OSError:
        logger.exception("Could not delete uploaded file: %s", path)
        return False


def delete_files(filenames: Optional[Iterable[Union[str, Path]]]) -> int:
    if not filenames:
        return 0

    deleted_count = 0
    for filename in filenames:
        if delete_file(filename):
            deleted_count += 1

    return deleted_count