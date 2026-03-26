import os
import pytest
from unittest.mock import MagicMock

# Must be set before any app module is imported, because config.Settings()
# is instantiated at module level.
os.environ.update({
    "SUPABASE_URL":              "https://test.supabase.co",
    "SUPABASE_SERVICE_ROLE_KEY": "test-service-key",
    "AWS_ACCESS_KEY_ID":         "test",
    "AWS_SECRET_ACCESS_KEY":     "test",
    "AWS_BUCKET":                "test-bucket",
    "NOMINATIM_API_HOST":        "https://nominatim.openstreetmap.org/reverse",
    "WEATHER_API_HOST":          "https://api.openweathermap.org/data/2.5/weather",
    "WEATHER_API_KEY":           "test",
    "EMAIL_SIGNER":              "test@example.com",
})

from fastapi.testclient import TestClient  # noqa: E402
from main import app                       # noqa: E402
from dependencies import get_current_user, get_user_id  # noqa: E402

FAKE_USER_ID = "00000000-0000-0000-0000-000000000001"

app.dependency_overrides[get_current_user] = lambda: {"sub": FAKE_USER_ID}
app.dependency_overrides[get_user_id]      = lambda: FAKE_USER_ID


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def mock_supabase(monkeypatch):
    """Returns a MagicMock wired up as the supabase client in all routers."""
    mock = MagicMock()
    monkeypatch.setattr("routers.sightings.supabase", mock)
    monkeypatch.setattr("routers.users.supabase",     mock)
    return mock
