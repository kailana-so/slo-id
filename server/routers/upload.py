import base64
from uuid import uuid4

import boto3
from botocore.exceptions import BotoCoreError, ClientError
from fastapi import APIRouter, HTTPException
from config import settings
from models import ImageUploadRequest, PresignRequest

router = APIRouter(prefix="/api/upload", tags=["upload"])


def _s3_client():
    return boto3.client(
        "s3",
        region_name=settings.aws_region,
        aws_access_key_id=settings.aws_access_key_id,
        aws_secret_access_key=settings.aws_secret_access_key,
    )


@router.post("/image")
async def upload_image(body: ImageUploadRequest):
    """Upload thumbnail + full photo from base64. Used for photos only."""
    s3 = _s3_client()
    base_key = f"{body.user_id}/{uuid4()}"
    thumbnail_key = f"thumbnail/{base_key}_thumbnail.png"
    full_key = f"full/{base_key}_full.png"

    try:
        thumbnail_bytes = base64.b64decode(body.thumbnail_image_file)
        full_bytes = base64.b64decode(body.full_image_file)

        for key, data in [(thumbnail_key, thumbnail_bytes), (full_key, full_bytes)]:
            s3.put_object(
                Bucket=settings.aws_bucket,
                Key=key,
                Body=data,
                ContentType="image/png",
            )
    except (BotoCoreError, ClientError) as e:
        raise HTTPException(status_code=502, detail=f"S3 upload error: {e}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image data: {e}")

    return {
        "message": "Image uploaded successfully",
        "result": {
            "thumbnail_key": thumbnail_key,
            "full_key": full_key,
        },
    }


@router.post("/presign")
async def presign_upload(body: PresignRequest):
    """
    Returns a presigned PUT URL for direct client-to-S3 upload.
    Used for video and audio — avoids routing large files through the server.
    """
    s3 = _s3_client()
    key = f"{body.media_type.value}/{body.user_id}/{uuid4()}_{body.filename}"

    try:
        url = s3.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": settings.aws_bucket,
                "Key": key,
                "ContentType": body.content_type,
            },
            ExpiresIn=300,
        )
    except (BotoCoreError, ClientError) as e:
        raise HTTPException(status_code=502, detail=f"S3 presign error: {e}")

    return {"url": url, "key": key}
