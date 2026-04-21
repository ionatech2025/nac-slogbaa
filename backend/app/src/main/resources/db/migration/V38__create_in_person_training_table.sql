-- V38: In-Person Training table
CREATE TABLE IF NOT EXISTS in_person_training (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title             VARCHAR(255) NOT NULL,
    eyebrow           VARCHAR(255),
    event_date        TIMESTAMPTZ NOT NULL,
    location          VARCHAR(255) NOT NULL,
    facilitators      TEXT, -- Comma-separated names
    tags              TEXT, -- Comma-separated tags
    image_url         TEXT,
    excerpt           TEXT,
    intro             TEXT,
    content           TEXT, -- Markdown content
    slug              VARCHAR(255) UNIQUE NOT NULL,
    sort_order        INT NOT NULL DEFAULT 0,
    active            BOOLEAN NOT NULL DEFAULT true,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ipt_event_date ON in_person_training (event_date);
CREATE INDEX IF NOT EXISTS idx_ipt_active ON in_person_training (active);
