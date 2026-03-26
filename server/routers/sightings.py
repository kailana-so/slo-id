from fastapi import APIRouter, Depends, HTTPException, Query
from db import supabase
from dependencies import get_user_id
from models import SightingCreate, SightingUpdate, SightingResponse, SightingListResponse

router = APIRouter(prefix="/api/sightings", tags=["sightings"])

PAGE_SIZE = 10


@router.post("/", response_model=SightingResponse, status_code=201)
async def create_sighting(body: SightingCreate, user_id: str = Depends(get_user_id)):
    data = {
        "user_id": user_id,
        "media":   [m.model_dump() for m in body.media],
        **body.model_dump(exclude={"media"}, exclude_none=True),
    }
    result = supabase.table("sightings").insert(data).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create sighting")
    return result.data[0]


@router.get("/", response_model=SightingListResponse)
async def list_sightings(
    status: str | None = Query(None),
    page:   int        = Query(1, ge=1),
    user_id: str       = Depends(get_user_id),
):
    offset = (page - 1) * PAGE_SIZE
    query = (
        supabase.table("sightings")
        .select("*", count="exact")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .range(offset, offset + PAGE_SIZE - 1)
    )
    if status:
        query = query.eq("status", status)

    result = query.execute()
    return {
        "sightings": result.data,
        "count":     result.count or 0,
        "page":      page,
        "page_size": PAGE_SIZE,
    }


@router.get("/map")
async def map_pins(user_id: str = Depends(get_user_id)):
    """All sightings with coordinates for the map view."""
    result = (
        supabase.table("sightings")
        .select("id, type, status, name, latitude, longitude, created_at, media")
        .eq("user_id", user_id)
        .not_.is_("latitude", "null")
        .execute()
    )
    return {"pins": result.data}


@router.get("/nearby")
async def nearby(
    lat:       float = Query(...),
    lng:       float = Query(...),
    radius_km: float = Query(2.0),
    user_id:   str   = Depends(get_user_id),
):
    """
    Returns sightings within radius_km of the given coordinates.
    Filtering is done in-process using the Haversine formula.
    When the dataset grows, replace with a PostGIS ST_DWithin query.
    """
    import math

    result = (
        supabase.table("sightings")
        .select("id, type, status, name, latitude, longitude, created_at, media")
        .eq("user_id", user_id)
        .not_.is_("latitude", "null")
        .execute()
    )

    def haversine(lat1, lon1, lat2, lon2) -> float:
        R = 6371
        d_lat = math.radians(lat2 - lat1)
        d_lon = math.radians(lon2 - lon1)
        a = math.sin(d_lat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d_lon / 2) ** 2
        return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    nearby = [
        s for s in result.data
        if haversine(lat, lng, s["latitude"], s["longitude"]) <= radius_km
    ]
    return {"sightings": nearby}


@router.get("/{sighting_id}", response_model=SightingResponse)
async def get_sighting(sighting_id: str, user_id: str = Depends(get_user_id)):
    result = (
        supabase.table("sightings")
        .select("*")
        .eq("id", sighting_id)
        .eq("user_id", user_id)
        .maybe_single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Sighting not found")
    return result.data


@router.patch("/{sighting_id}", response_model=SightingResponse)
async def update_sighting(
    sighting_id: str,
    body: SightingUpdate,
    user_id: str = Depends(get_user_id),
):
    updates = body.model_dump(exclude_none=True)
    if "media" in updates:
        updates["media"] = [m.model_dump() for m in body.media]
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = (
        supabase.table("sightings")
        .update(updates)
        .eq("id", sighting_id)
        .eq("user_id", user_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Sighting not found")
    return result.data[0]


@router.delete("/{sighting_id}", status_code=204)
async def delete_sighting(sighting_id: str, user_id: str = Depends(get_user_id)):
    """Only sightings and drafts can be deleted — identifications are the record."""
    result = (
        supabase.table("sightings")
        .select("status")
        .eq("id", sighting_id)
        .eq("user_id", user_id)
        .maybe_single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Sighting not found")
    if result.data["status"] == "identification":
        raise HTTPException(status_code=403, detail="Identifications cannot be deleted")

    supabase.table("sightings").delete().eq("id", sighting_id).execute()
