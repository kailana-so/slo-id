def test_health(client):
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


def test_protected_route_requires_auth():
    """Without the dependency override, a raw request should be rejected."""
    from fastapi.testclient import TestClient
    from main import app
    from dependencies import get_current_user, get_user_id

    # Remove overrides temporarily
    overrides = app.dependency_overrides.copy()
    app.dependency_overrides.pop(get_current_user, None)
    app.dependency_overrides.pop(get_user_id, None)

    try:
        raw = TestClient(app, raise_server_exceptions=False)
        res = raw.get("/api/sightings/")
        assert res.status_code in (401, 403)
    finally:
        app.dependency_overrides.update(overrides)
