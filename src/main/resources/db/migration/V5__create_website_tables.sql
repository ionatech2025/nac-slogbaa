-- ---------------------------------------------------------------------------
-- Public Website Context
-- HomepageContent (singleton), BannerImage, ImpactStory, NewsUpdate,
-- VideoContent, PartnerLogo
-- ---------------------------------------------------------------------------

CREATE TABLE homepage_content (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_updated_by UUID REFERENCES staff_user (id),
    last_updated_at TIMESTAMP WITH TIME ZONE,
    whatsapp_url    VARCHAR(2048),
    facebook_url    VARCHAR(2048),
    twitter_url     VARCHAR(2048),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

-- ---------------------------------------------------------------------------

CREATE TABLE banner_image (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    homepage_content_id      UUID NOT NULL REFERENCES homepage_content (id) ON DELETE CASCADE,
    image_url               VARCHAR(2048) NOT NULL,
    alt_text                VARCHAR(255),
    display_order           INT NOT NULL DEFAULT 0,
    is_active               BOOLEAN NOT NULL DEFAULT true,
    uploaded_at             TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE INDEX idx_banner_image_homepage ON banner_image (homepage_content_id);

-- ---------------------------------------------------------------------------

CREATE TABLE impact_story (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    homepage_content_id      UUID NOT NULL REFERENCES homepage_content (id) ON DELETE CASCADE,
    title                   VARCHAR(500) NOT NULL,
    summary                 VARCHAR(1000),
    full_story              TEXT,
    image_url               VARCHAR(2048),
    image_alt_text          VARCHAR(255),
    published_at            TIMESTAMP WITH TIME ZONE,
    is_published            BOOLEAN NOT NULL DEFAULT false,
    view_count              INT NOT NULL DEFAULT 0,
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE INDEX idx_impact_story_homepage ON impact_story (homepage_content_id);
CREATE INDEX idx_impact_story_published ON impact_story (is_published) WHERE is_published = true;

-- ---------------------------------------------------------------------------

CREATE TABLE news_update (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    homepage_content_id      UUID NOT NULL REFERENCES homepage_content (id) ON DELETE CASCADE,
    title                   VARCHAR(500) NOT NULL,
    content                 TEXT,
    published_at            TIMESTAMP WITH TIME ZONE,
    is_published            BOOLEAN NOT NULL DEFAULT false,
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE INDEX idx_news_update_homepage ON news_update (homepage_content_id);
CREATE INDEX idx_news_update_published ON news_update (is_published) WHERE is_published = true;

-- ---------------------------------------------------------------------------

CREATE TABLE video_content (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    homepage_content_id      UUID NOT NULL REFERENCES homepage_content (id) ON DELETE CASCADE,
    title                   VARCHAR(500) NOT NULL,
    youtube_url             VARCHAR(2048),
    youtube_video_id        VARCHAR(50),
    display_order           INT NOT NULL DEFAULT 0,
    added_at                TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE INDEX idx_video_content_homepage ON video_content (homepage_content_id);

-- ---------------------------------------------------------------------------

CREATE TABLE partner_logo (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    homepage_content_id      UUID NOT NULL REFERENCES homepage_content (id) ON DELETE CASCADE,
    partner_name            VARCHAR(255) NOT NULL,
    logo_url                VARCHAR(2048) NOT NULL,
    alt_text                VARCHAR(255),
    display_order           INT NOT NULL DEFAULT 0,
    is_active               BOOLEAN NOT NULL DEFAULT true,
    added_at                TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE INDEX idx_partner_logo_homepage ON partner_logo (homepage_content_id);
