import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from config import settings

router = APIRouter(prefix="/api/weather", tags=["weather"])


class WeatherRequest(BaseModel):
    lat: float
    lng: float


@router.post("/")
async def weather(body: WeatherRequest):
    url = (
        f"{settings.weather_api_host}"
        f"?lat={body.lat}&lon={body.lng}&units=metric&appid={settings.weather_api_key}"
    )

    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(url, timeout=10)
            resp.raise_for_status()
        except httpx.HTTPError as e:
            raise HTTPException(status_code=502, detail=f"Weather API error: {e}")

    return resp.json()
