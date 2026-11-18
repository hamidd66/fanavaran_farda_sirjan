import asyncio
import logging
import os
import uuid
from pathlib import Path, PurePosixPath
from typing import List
import aiofiles
from fastapi import UploadFile
from app.core.exceptions.custom_exceptions import AppException
from app.enums.response_codes import ResponseCode
from PIL import Image

from app.config.settings import settings


logger = logging.getLogger(__name__)

IMAGE_CHUNK_SIZE = 1024 * 1024 # 1MB

IMAGE_MAX_FILES = 10
IMAGE_MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
IMAGE_MAX_TOTAL_SIZE = IMAGE_MAX_FILE_SIZE * IMAGE_MAX_FILES
IMAGE_MAX_PIXELS = 25_000_000
IMAGE_MAX_FRAMES = 100
IMAGE_MAX_PARALLEL_CHECKS = 4
IMAGE_ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "heic", "heif", "avif"]
IMAGE_ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "image/avif"]
IMAGE_FORMAT_ALIASES = {
    "jpeg": "jpg",
    "mpo": "jpg",
    "tif": "tiff",
}

# Image dimension rules by FilePurpose.
# ratio:
#   None       -> Any aspect ratio is allowed.
#   (1, 1)     -> Square image.
#   (16, 9)    -> 16:9 image.
# min_size: Minimum (width, height).
# tolerance: Allowed relative ratio difference.
IMAGE_PURPOSE_RULES = {
    "avatar": {
        "ratio": (1, 1),
        "min_size": (256, 256),
    },
    "thumbnail": {
        "ratio": (1, 1),
        "min_size": (128, 128),
    },
    "cover": {
        "ratio": (16, 9),
        "min_size": None,
        "tolerance": 0.01,
    },
    "banner": {
        "ratio": (16, 9),
        "min_size": None,
        "tolerance": 0.01,
    },
    "image": {
        "ratio": None,
        "min_size": None,
    },
    "gallery": {
        "ratio": None,
        "min_size": None,
    },
    "logo": {
        "ratio": None,
        "min_size": None,
    },
}


UPLOAD_ROOT = Path("media") / "uploads"

Image.MAX_IMAGE_PIXELS = IMAGE_MAX_PIXELS

_image_check_semaphore = asyncio.Semaphore(IMAGE_MAX_PARALLEL_CHECKS)


def _normalize_ext(ext: str) -> str:
    return IMAGE_FORMAT_ALIASES.get(ext, ext)

def _get_ext(file: UploadFile) -> str:
    filename = file.filename or ""
    return filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

def _validate_image_dimensions(
    width: int,
    height: int,
    purpose: str,
) -> None:
    rule = IMAGE_PURPOSE_RULES.get(purpose)

    # No dimension rule means unrestricted dimensions.
    if rule is None:
        raise ValueError(f"No image dimension rule configured for purpose '{purpose}'")

    min_size = rule.get("min_size")

    if min_size:
        min_width, min_height = min_size

        if width < min_width or height < min_height:
            raise ValueError(f"Image must be at least {min_width}x{min_height} for purpose '{purpose}'")

    expected_ratio = rule.get("ratio")

    if expected_ratio is None:
        return

    ratio_width, ratio_height = expected_ratio

    # Exact square ratio.
    if ratio_width == ratio_height:
        if width != height:
            raise ValueError(
                f"Image must have a 1:1 aspect ratio "
                f"for purpose '{purpose}'"
            )
        return

    tolerance = rule.get("tolerance", 0.0)

    expected = ratio_width / ratio_height
    actual = width / height

    difference = abs(actual - expected) / expected

    if difference > tolerance:
        raise ValueError(
            f"Image must have an approximately "
            f"{ratio_width}:{ratio_height} aspect ratio "
            f"for purpose '{purpose}'"
        )

def _check_image(path: str, ext: str, purpose: str) -> None:
    with Image.open(path) as img:
        real_format = _normalize_ext((img.format or "").lower())

        if real_format not in IMAGE_ALLOWED_EXTENSIONS:
            raise ValueError("Unsupported image format")

        if real_format != _normalize_ext(ext):
            raise ValueError("Extension does not match content")

        width, height = img.size

        if width <= 0 or height <= 0:
            raise ValueError("Invalid image dimensions")

        if width * height > IMAGE_MAX_PIXELS:
            raise ValueError("Image dimensions too large")

        _validate_image_dimensions(width, height, purpose)

        if getattr(img, "n_frames", 1) > IMAGE_MAX_FRAMES:
            raise ValueError("Too many image frames")

        img.verify()

    with Image.open(path) as img:
        img.load()

def _remove_file(path: Path) -> None:
    try:
        path.unlink(missing_ok=True)
    except OSError:
        logger.exception("Could not remove file: %s", path)

async def _save_file(file: UploadFile, path: Path, max_size: int) -> int:
    size = 0

    async with aiofiles.open(path, "wb") as buffer:
        while chunk := await file.read(IMAGE_CHUNK_SIZE):
            size += len(chunk)

            if size > max_size:
                raise AppException(code=ResponseCode.FILE_TOO_LARGE, message="File too large")

            await buffer.write(chunk)

    return size

async def _check_image_async(path: Path, ext: str, purpose: str) -> None:
    async with _image_check_semaphore:
        task = asyncio.create_task(
            asyncio.to_thread(
                _check_image,
                str(path),
                ext,
                purpose,
            )
        )
        try:
            await asyncio.shield(task)
        except asyncio.CancelledError:
            await asyncio.gather(task, return_exceptions=True)
            raise

def _safe_upload_dir(folder_name: str) -> Path:
    root = UPLOAD_ROOT.resolve()
    path = (UPLOAD_ROOT / folder_name).resolve()

    if root not in path.parents and path != root:
        raise AppException(code=ResponseCode.BAD_REQUEST, message="Invalid upload path")

    return path

def cleanup_temp_files() -> None:
    if not UPLOAD_ROOT.exists():
        return

    for tmp_file in UPLOAD_ROOT.rglob("*.tmp"):
        try:
            tmp_file.unlink()
        except OSError:
            logger.exception("Could not remove temp file: %s", tmp_file)


async def upload_files(
    folder_name: str,
    files: List[UploadFile],
    purposes_by_file: List[str],
) -> List[dict]:

    saved_paths: List[Path] = []
    results: List[dict] = []

    try:
        if folder_name not in settings.ALLOWED_FOLDERS:
            raise AppException(code=ResponseCode.BAD_REQUEST, message="Invalid folder")

        if not files:
            raise AppException(code=ResponseCode.BAD_REQUEST, message="At least one file is required")

        if len(purposes_by_file) != len(files):
            raise AppException(code=ResponseCode.BAD_REQUEST, message="Each file must have exactly one purpose")

        if len(files) > IMAGE_MAX_FILES:
            raise AppException(code=ResponseCode.BAD_REQUEST, message=f"Maximum {IMAGE_MAX_FILES} files allowed")

        extensions = []
        declared_total = 0

        for file in files:
            if file.content_type not in IMAGE_ALLOWED_CONTENT_TYPES:
                raise AppException(code=ResponseCode.BAD_REQUEST, message="Only image files are allowed")

            ext = _get_ext(file)

            if ext not in IMAGE_ALLOWED_EXTENSIONS:
                raise AppException(code=ResponseCode.BAD_REQUEST, message="Invalid file extension")

            extensions.append(ext)

            if file.size is not None:
                if file.size > IMAGE_MAX_FILE_SIZE:
                    raise AppException(code=ResponseCode.FILE_TOO_LARGE, message="File too large")
                declared_total += file.size

        if declared_total > IMAGE_MAX_TOTAL_SIZE:
            raise AppException(code=ResponseCode.FILE_TOO_LARGE, message="Total upload size exceeded")

        upload_dir = _safe_upload_dir(folder_name)
        await asyncio.to_thread(upload_dir.mkdir, parents=True, exist_ok=True)

        total_size = 0

        for idx, file in enumerate(files):
            ext = extensions[idx]
            purpose = purposes_by_file[idx]
            file_name = f"{uuid.uuid4().hex}.{ext}"

            tmp_path = upload_dir / f"{uuid.uuid4().hex}.tmp"
            final_path = upload_dir / file_name

            try:
                max_size = min(IMAGE_MAX_FILE_SIZE, IMAGE_MAX_TOTAL_SIZE - total_size)

                size = await _save_file(file, tmp_path, max_size)
                total_size += size

                try:
                    await _check_image_async(tmp_path, ext, purpose)
                except asyncio.CancelledError:
                    raise
                except Exception:
                    raise AppException(code=ResponseCode.BAD_REQUEST, message="Invalid or corrupted image file")

                os.replace(tmp_path, final_path)
                saved_paths.append(final_path)

            finally:
                _remove_file(tmp_path)

            url = "/" + str(
                PurePosixPath("media", "uploads", folder_name, file_name)
            )

            results.append({
                "url": url,
                "path": str(final_path.resolve()),
                "file_ext": ext,
                "size": size,
            })

        return results

    except (AppException, asyncio.CancelledError):
        for path in saved_paths:
            _remove_file(path)
        raise

    except Exception as e:
        logger.exception("Upload failed unexpectedly")
        for path in saved_paths:
            _remove_file(path)
        raise AppException(code=ResponseCode.FILE_UPLOAD_FAILED, message="Upload failed") from e

    finally:
        for file in files:
            try:
                await file.close()
            except Exception:
                logger.exception("Could not close uploaded file: %s", file.filename)

