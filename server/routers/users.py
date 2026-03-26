from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from db import supabase
from dependencies import get_user_id
from models import UserCreate, UserResponse

router = APIRouter(prefix="/api/users", tags=["users"])


@router.post("/", response_model=UserResponse, status_code=201)
async def create_user(body: UserCreate, user_id: str = Depends(get_user_id)):
    """Create a profile row after Supabase Auth signup."""
    result = (
        supabase.table("users")
        .insert({"id": user_id, "username": body.username, "email": body.email})
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create user")
    return result.data[0]


@router.get("/me", response_model=UserResponse)
async def get_me(user_id: str = Depends(get_user_id)):
    result = supabase.table("users").select("*").eq("id", user_id).maybe_single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")
    return result.data


@router.patch("/me", response_model=UserResponse)
async def update_me(body: dict, user_id: str = Depends(get_user_id)):
    allowed = {"username"}
    updates = {k: v for k, v in body.items() if k in allowed}
    if not updates:
        raise HTTPException(status_code=400, detail="No valid fields to update")

    result = (
        supabase.table("users")
        .update(updates)
        .eq("id", user_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")
    return result.data[0]


@router.delete("/me", status_code=204)
async def delete_me(user_id: str = Depends(get_user_id)):
    """
    Soft delete — anonymises PII so the user's sightings remain in the
    scientific dataset with a stable user_id reference.
    """
    supabase.table("users").update({
        "username":   "deleted_user",
        "email":      f"deleted_{user_id}@deleted",
        "deleted_at": datetime.now(timezone.utc).isoformat(),
    }).eq("id", user_id).execute()
