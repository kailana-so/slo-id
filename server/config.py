from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Server
    client_url: str = "http://localhost:5173"
    port: int = 8000

    # Supabase
    supabase_url: str
    supabase_service_role_key: str  # server-side only

    # AWS S3
    aws_region: str = "ap-southeast-2"
    aws_access_key_id: str
    aws_secret_access_key: str
    aws_bucket: str

    # External APIs
    nominatim_api_host: str
    weather_api_host: str
    weather_api_key: str
    email_signer: str  # User-Agent string for Nominatim


settings = Settings()
