-- =============================================================================
-- slo-id initial schema
-- =============================================================================

-- Enable pgvector now for RAG later
CREATE EXTENSION IF NOT EXISTS vector;


-- =============================================================================
-- Helpers
-- =============================================================================

-- Auto-update updated_at on any row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- =============================================================================
-- Users
-- =============================================================================
-- Extends Supabase's auth.users. id mirrors auth.users.id.
--
-- Sightings and identifications are the scientific record — they must outlive
-- individual users. For this reason:
--   - Users are SOFT DELETED: PII is anonymised, the row is retained so all
--     foreign key references remain valid and sightings stay attributed to a
--     stable user_id in the dataset.
--   - Hard deletion from auth.users is intentionally avoided. If it does occur
--     the FK here is SET NULL rather than CASCADE so the user row becomes
--     unlinked but still present for historical data integrity.

CREATE TABLE public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE SET NULL,
  username    TEXT NOT NULL,
  email       TEXT NOT NULL,
  deleted_at  TIMESTAMPTZ,    -- NULL = active; set when user leaves
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- =============================================================================
-- Sightings
-- =============================================================================
-- A single table covers the full lifecycle:
--   sighting     → media captured, location + env data recorded
--   draft        → enriched with species form fields
--   identification → confirmed
--
-- Variable form fields live in the `fields` JSONB column so the schema
-- doesn't need to change as new species types or form fields are added.
-- The `media` column stores an array of S3 references with their type
-- so photos, video, and audio all live together.
--
-- Example media entry:
--   {"key": "abc123/full/uuid_full.png", "media_type": "photo"}
--   {"key": "abc123/video/uuid.mp4",     "media_type": "video"}
--   {"key": "abc123/audio/uuid.m4a",     "media_type": "audio"}

CREATE TYPE sighting_status AS ENUM ('sighting', 'draft', 'identification');
CREATE TYPE species_type    AS ENUM ('insect', 'plant', 'reptile', 'bird');

CREATE TABLE public.sightings (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Nullable: if a user is removed from auth their sightings are retained,
  -- user_id becomes NULL (unattributed) but the record stays in the dataset.
  user_id     UUID        REFERENCES public.users(id) ON DELETE SET NULL,

  -- Classification (nullable — set at capture, refined later)
  type        species_type,
  status      sighting_status NOT NULL DEFAULT 'sighting',
  name        TEXT,

  -- Media: [{key: string, media_type: 'photo'|'video'|'audio'}]
  media       JSONB       NOT NULL DEFAULT '[]'::jsonb,

  -- Location
  latitude    DOUBLE PRECISION,
  longitude   DOUBLE PRECISION,
  location    JSONB,       -- reverse geocode result (road, city, state, etc.)

  -- Environmental context captured at time of sighting
  environment JSONB,       -- weather, terrain, conditions

  -- Species form enrichment — added in step 2, keyed by form field name
  fields      JSONB        NOT NULL DEFAULT '{}'::jsonb,

  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER sightings_updated_at
  BEFORE UPDATE ON public.sightings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- =============================================================================
-- Confirmations (stub — not yet active)
-- =============================================================================
-- Community confirmation model: when 3 distinct users confirm a sighting's
-- species, it is promoted to an identification. Logic will live in the
-- FastAPI service layer (or a Postgres function) when this is built out.
--
-- CREATE TABLE public.confirmations (
--   id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
--   sighting_id UUID        NOT NULL REFERENCES public.sightings(id) ON DELETE CASCADE,
--   user_id     UUID        REFERENCES public.users(id) ON DELETE SET NULL,
--   created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
--   UNIQUE (sighting_id, user_id)  -- one confirmation per user per sighting
-- );
--
-- CREATE INDEX idx_confirmations_sighting ON public.confirmations (sighting_id);


-- =============================================================================
-- Indexes
-- =============================================================================

-- Primary query pattern: user's sightings by status, newest first
CREATE INDEX idx_sightings_user_status    ON public.sightings (user_id, status, created_at DESC);

-- Map / nearby queries
CREATE INDEX idx_sightings_location       ON public.sightings (user_id, latitude, longitude)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- JSONB field lookups (fields enrichment queries later)
CREATE INDEX idx_sightings_fields         ON public.sightings USING GIN (fields);


-- =============================================================================
-- Row Level Security
-- =============================================================================
-- All data access is scoped to the authenticated user. The FastAPI server
-- uses the Supabase service role key, so RLS only applies to direct client
-- access (e.g. Supabase dashboard, future client-side calls if any).

ALTER TABLE public.users    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sightings ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own profile
CREATE POLICY "users: own row only"
  ON public.users
  FOR ALL
  USING      (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Sightings scoped to owner
CREATE POLICY "sightings: own rows only"
  ON public.sightings
  FOR ALL
  USING      (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
