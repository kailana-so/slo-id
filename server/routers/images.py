import boto3
from fastapi import APIRouter, HTTPException
from botocore.exceptions import BotoCoreError, ClientError
from pydantic import BaseModel
from config import settings
from models import SignedUrlRequest

router = APIRouter(prefix="/api/images", tags=["images"])


class KeysRequest(BaseModel):
    keys: list[str]


def _s3_client():
    return boto3.client(
        "s3",
        region_name=settings.aws_region,
        aws_access_key_id=settings.aws_access_key_id,
        aws_secret_access_key=settings.aws_secret_access_key,
    )


@router.post("/")
async def get_signed_urls(body: SignedUrlRequest):
    s3 = _s3_client()
    try:
        urls = [
            {
                "filename": filename,
                "url": s3.generate_presigned_url(
                    "get_object",
                    Params={
                        "Bucket": settings.aws_bucket,
                        "Key": f"{body.image_type}/{body.user_id}/{filename}_{body.image_type}.png",
                    },
                    ExpiresIn=600,
                ),
            }
            for filename in body.filenames
        ]
    except (BotoCoreError, ClientError) as e:
        raise HTTPException(status_code=502, detail=f"S3 error: {e}")

    return {"urls": urls}


@router.post("/keys")
async def get_signed_urls_by_key(body: KeysRequest):
    """Return presigned GET URLs for a list of full S3 keys."""
    s3 = _s3_client()
    try:
        urls = [
            {
                "key": key,
                "url": s3.generate_presigned_url(
                    "get_object",
                    Params={"Bucket": settings.aws_bucket, "Key": key},
                    ExpiresIn=600,
                ),
            }
            for key in body.keys
        ]
    except (BotoCoreError, ClientError) as e:
        raise HTTPException(status_code=502, detail=f"S3 error: {e}")
    return {"urls": urls}
