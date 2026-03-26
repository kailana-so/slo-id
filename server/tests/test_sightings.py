import uuid

FAKE_USER_ID = "00000000-0000-0000-0000-000000000001"


def _sighting(overrides=None):
    base = {
        "id":          str(uuid.uuid4()),
        "user_id":     FAKE_USER_ID,
        "type":        "insect",
        "status":      "sighting",
        "name":        None,
        "media":       [],
        "latitude":    None,
        "longitude":   None,
        "location":    None,
        "environment": None,
        "fields":      {},
        "created_at":  "2026-01-01T00:00:00",
        "updated_at":  "2026-01-01T00:00:00",
    }
    return {**base, **(overrides or {})}


def test_list_sightings(client, mock_supabase):
    mock_supabase.table().select().eq().order().range().execute.return_value.data  = [_sighting()]
    mock_supabase.table().select().eq().order().range().execute.return_value.count = 1

    res = client.get("/api/sightings/")
    assert res.status_code == 200
    body = res.json()
    assert body["count"] == 1
    assert len(body["sightings"]) == 1


def test_create_sighting(client, mock_supabase):
    new = _sighting()
    mock_supabase.table().insert().execute.return_value.data = [new]

    res = client.post("/api/sightings/", json={"type": "insect", "media": []})
    assert res.status_code == 201
    assert res.json()["type"] == "insect"


def test_create_sighting_no_type(client, mock_supabase):
    """Media-only sighting — type is optional."""
    new = _sighting({"type": None})
    mock_supabase.table().insert().execute.return_value.data = [new]

    res = client.post("/api/sightings/", json={"media": []})
    assert res.status_code == 201


def test_delete_identification_is_forbidden(client, mock_supabase):
    """Identifications are the scientific record and cannot be deleted."""
    sighting_id = str(uuid.uuid4())
    mock_supabase.table().select().eq().eq().single().execute.return_value.data = _sighting({
        "id":     sighting_id,
        "status": "identification",
    })

    res = client.delete(f"/api/sightings/{sighting_id}")
    assert res.status_code == 403


def test_delete_sighting_succeeds(client, mock_supabase):
    sighting_id = str(uuid.uuid4())
    mock_supabase.table().select().eq().eq().single().execute.return_value.data = _sighting({
        "id":     sighting_id,
        "status": "sighting",
    })
    mock_supabase.table().delete().eq().execute.return_value.data = [{}]

    res = client.delete(f"/api/sightings/{sighting_id}")
    assert res.status_code == 204
