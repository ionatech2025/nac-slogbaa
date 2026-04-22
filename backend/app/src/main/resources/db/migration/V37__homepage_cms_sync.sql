-- V37: Add missing homepage fields to sync entities and DB
-- News Updates
ALTER TABLE homepage_news ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Banners
ALTER TABLE homepage_banner ADD COLUMN IF NOT EXISTS eyebrow VARCHAR(255);
ALTER TABLE homepage_banner ADD COLUMN IF NOT EXISTS highlight VARCHAR(255);

-- Impact Stories
ALTER TABLE homepage_story ADD COLUMN IF NOT EXISTS title VARCHAR(500);
ALTER TABLE homepage_story ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE homepage_story ADD COLUMN IF NOT EXISTS courses_completed VARCHAR(255);
ALTER TABLE homepage_story ADD COLUMN IF NOT EXISTS project_impact TEXT;
ALTER TABLE homepage_story ADD COLUMN IF NOT EXISTS certification VARCHAR(255);
ALTER TABLE homepage_story ADD COLUMN IF NOT EXISTS story_text TEXT;
