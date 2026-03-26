import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from config import settings

router = APIRouter(prefix="/api/geolocate", tags=["geolocate"])


class GeolocateRequest(BaseModel):
    lat: float
    lng: float


@router.post("/")
async def geolocate(body: GeolocateRequest):
    url = f"{settings.nominatim_api_host}?format=jsonv2&lat={body.lat}&lon={body.lng}"
    headers = {"User-Agent": f"slo-id/1.0 ({settings.email_signer})"}

    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(url, headers=headers, timeout=10)
            resp.raise_for_status()
        except httpx.HTTPError as e:
            raise HTTPException(status_code=502, detail=f"Nominatim error: {e}")

    data = resp.json()
    address = data.get("address", {})

    city = address.get("city") or address.get("municipality")
    if not city:
        raise HTTPException(status_code=404, detail="No location components found")

    return {
        "road":         address.get("road"),
        "town":         address.get("town"),
        "city":         city,
        "municipality": address.get("municipality"),
        "state":        address.get("state"),
        "postcode":     address.get("postcode"),
        "country_code": address.get("country_code"),
        "boundingbox":  data.get("boundingbox"),
    }
