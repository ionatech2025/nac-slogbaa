-- V41: Simplify homepage_banner by removing text fields
ALTER TABLE homepage_banner DROP COLUMN IF EXISTS title;
ALTER TABLE homepage_banner DROP COLUMN IF EXISTS eyebrow;
ALTER TABLE homepage_banner DROP COLUMN IF EXISTS highlight;
ALTER TABLE homepage_banner DROP COLUMN IF EXISTS subtitle;
