from __future__ import annotations
from datetime import datetime
from enum import Enum
from typing import Any
from uuid import UUID

from pydantic import BaseModel, EmailStr


# =============================================================================
# Enums
# =============================================================================

class SightingStatus(str, Enum):
    sighting       = "sighting"
    draft          = "draft"
    identification = "identification"


class MediaType(str, Enum):
    photo = "photo"
    video = "video"
    audio = "audio"


# =============================================================================
# Media
# =============================================================================

class MediaItem(BaseModel):
    key:           str
    media_type:    MediaType
    thumbnail_key: str | None = None  # photos only


# =============================================================================
# Users
# =============================================================================

class UserCreate(BaseModel):
    username: str
    email:    EmailStr


class UserResponse(BaseModel):
    id:         UUID
    username:   str
    email:      str
    created_at: datetime
    updated_at: datetime


# =============================================================================
# Sightings
# =============================================================================

class SightingCreate(BaseModel):
    type:        str | None         = None
    media:       list[MediaItem]    = []
    latitude:    float | None       = None
    longitude:   float | None       = None
    location:    dict[str, Any] | None = None
    environment: dict[str, Any] | None = None


class SightingUpdate(BaseModel):
    name:        str | None             = None
    type:        str | None             = None
    status:      SightingStatus | None  = None
    media:       list[MediaItem] | None = None
    latitude:    float | None           = None
    longitude:   float | None           = None
    location:    dict[str, Any] | None  = None
    environment: dict[str, Any] | None  = None
    fields:      dict[str, Any] | None  = None  # species form enrichment


class SightingResponse(BaseModel):
    id:          UUID
    user_id:     UUID | None
    type:        str | None
    status:      SightingStatus
    name:        str | None
    media:       list[MediaItem]
    latitude:    float | None
    longitude:   float | None
    location:    dict[str, Any] | None
    environment: dict[str, Any] | None
    fields:      dict[str, Any]
    created_at:  datetime
    updated_at:  datetime


class SightingListResponse(BaseModel):
    sightings: list[SightingResponse]
    count:     int
    page:      int
    page_size: int


# =============================================================================
# S3 Upload
# =============================================================================

class ImageUploadRequest(BaseModel):
    user_id:              str
    thumbnail_image_file: str  # base64
    full_image_file:      str  # base64


class PresignRequest(BaseModel):
    """Request a presigned PUT URL for direct client-to-S3 upload (video/audio)."""
    user_id:    str
    filename:   str
    media_type: MediaType
    content_type: str      # e.g. video/mp4, audio/m4a


class SignedUrlRequest(BaseModel):
    user_id:    str
    filenames:  list[str]
    image_type: str        # 'full' | 'thumbnail'
