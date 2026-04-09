-- ---------------------------------------------------------------------------
-- Live Session Speakers Table
-- ---------------------------------------------------------------------------

CREATE TABLE live_session_speaker (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    live_session_id   UUID NOT NULL REFERENCES live_session (id) ON DELETE CASCADE,
    name              VARCHAR(255) NOT NULL,
    role              VARCHAR(255),
    bio               TEXT,
    photo_url         TEXT,
    display_order     INT NOT NULL DEFAULT 0,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lss_session ON live_session_speaker (live_session_id);

-- Cleanup legacy JSON column
ALTER TABLE live_session DROP COLUMN speakers_json;
