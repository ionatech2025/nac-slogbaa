-- V30: Homepage CMS, site visitor counter, live sessions

-- ── Homepage Banners (hero carousel slides) ──
CREATE TABLE homepage_banner (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title          VARCHAR(255) NOT NULL,
    subtitle       TEXT,
    image_url      TEXT,
    sort_order     INT NOT NULL DEFAULT 0,
    active         BOOLEAN NOT NULL DEFAULT true,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Homepage Impact Stories ──
CREATE TABLE homepage_story (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_name    VARCHAR(255) NOT NULL,
    author_role    VARCHAR(255),
    quote_text     TEXT NOT NULL,
    image_url      TEXT,
    sort_order     INT NOT NULL DEFAULT 0,
    active         BOOLEAN NOT NULL DEFAULT true,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Homepage Videos (YouTube links) ──
CREATE TABLE homepage_video (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title          VARCHAR(255) NOT NULL,
    youtube_url    TEXT NOT NULL,
    sort_order     INT NOT NULL DEFAULT 0,
    active         BOOLEAN NOT NULL DEFAULT true,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Homepage Partner Logos ──
CREATE TABLE homepage_partner (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name           VARCHAR(255) NOT NULL,
    logo_url       TEXT,
    website_url    TEXT,
    sort_order     INT NOT NULL DEFAULT 0,
    active         BOOLEAN NOT NULL DEFAULT true,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Homepage News & Updates ──
CREATE TABLE homepage_news (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title          VARCHAR(255) NOT NULL,
    summary        TEXT,
    tag            VARCHAR(50),
    published_date DATE,
    sort_order     INT NOT NULL DEFAULT 0,
    active         BOOLEAN NOT NULL DEFAULT true,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Site Visitor Counter ──
CREATE TABLE site_visit (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visited_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    fingerprint    VARCHAR(64)
);
CREATE INDEX idx_site_visit_date ON site_visit (visited_at);

-- ── Live Sessions ──
CREATE TABLE live_session (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title            VARCHAR(255) NOT NULL,
    description      TEXT,
    provider         VARCHAR(20) NOT NULL DEFAULT 'ZOOM',
    meeting_url      TEXT NOT NULL,
    scheduled_at     TIMESTAMPTZ NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 60,
    active           BOOLEAN NOT NULL DEFAULT true,
    created_by       UUID,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_live_session_scheduled ON live_session (scheduled_at);
