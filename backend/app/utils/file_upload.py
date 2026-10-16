from fastapi import UploadFile, HTTPException
from typing import List, Optional
from pathlib import PurePosixPath
from PIL import Image
import aiofiles
import uuid
import os

from app.config.settings import settings
from app.utils.delete_file import delete_files


async def upload_files(
    folder_name: str,
    files: List[UploadFile],
    positions: Optional[List[str]] = None
) -> List[dict]:

    saved_paths = []
    
    try:
        if folder_name not in settings.ALLOWED_FOLDERS:
            raise HTTPException(status_code=400, detail="Invalid folder")
        
        if not files:
            raise HTTPException(status_code=400, detail="At least one file is required")
        
        if positions and len(files) != len(positions):
            raise HTTPException(status_code=400, detail="Files and positions length mismatch")
        
        UPLOAD_DIR = os.path.join("media", "uploads", folder_name)
        os.makedirs(UPLOAD_DIR, exist_ok=True)

        CHUNK_SIZE = 1024 * 1024  # 1MB

        results = []

        for idx, file in enumerate(files):

            if file.content_type not in settings.ALLOWED_CONTENT_TYPES:
                raise HTTPException(status_code=400, detail="Only image files are allowed")

            file_ext = (
                file.filename.rsplit(".", 1)[-1].lower()
                if "." in file.filename
                else ""
            )

            if file_ext not in settings.ALLOWED_EXTENSIONS:
                raise HTTPException(status_code=400, detail="Invalid file extension")

            file_name = f"{uuid.uuid4().hex}.{file_ext}"
            file_path = os.path.join(UPLOAD_DIR, file_name)

            file_size = 0
            file_saved = False

            try:
                async with aiofiles.open(file_path, "wb") as buffer:

                    while chunk := await file.read(CHUNK_SIZE):

                        file_size += len(chunk)

                        if file_size > settings.MAX_FILE_SIZE:
                            raise HTTPException(status_code=400, detail="File too large")

                        await buffer.write(chunk)

                    file_saved = True

                try:
                    with Image.open(file_path) as img: img.verify()

                except Exception:
                    os.remove(file_path)
                    raise HTTPException(status_code=400, detail="Invalid image file")

            finally:
                await file.close()
                if not file_saved and os.path.exists(file_path):
                    os.remove(file_path)

            url = "/" + str(PurePosixPath("media", "uploads", folder_name, file_name))

            saved_paths.append(url)

            results.append({
                "url": url,
                "position": positions[idx] if positions else None,
                "file_ext": file_ext,
                "size": file_size,
            })
        
        return results
    
    except HTTPException:
        delete_files(saved_paths)
        raise
    except Exception as e:
        delete_files(saved_paths)
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
    