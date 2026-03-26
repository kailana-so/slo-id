from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routers import geolocate, images, sightings, upload, users, weather

app = FastAPI(title="slo-id API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.client_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(geolocate.router)
app.include_router(weather.router)
app.include_router(images.router)
app.include_router(upload.router)
app.include_router(users.router)
app.include_router(sightings.router)


@app.get("/health")
async def health():
    return {"status": "ok"}
