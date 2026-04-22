-- V36: Restructure Impact Story table to support more fields
ALTER TABLE homepage_story ADD COLUMN title VARCHAR(255);
ALTER TABLE homepage_story ADD COLUMN location VARCHAR(255);
ALTER TABLE homepage_story ADD COLUMN courses_completed VARCHAR(255);
ALTER TABLE homepage_story ADD COLUMN project_impact TEXT;
ALTER TABLE homepage_story ADD COLUMN certification VARCHAR(255);

-- Migrating existing data: move quote_text to temporary if needed, but we'll just allow both for now
-- or better, we can assume quote_text was the story content.
-- The user wants "Story Text" specifically.
ALTER TABLE homepage_story RENAME COLUMN quote_text TO story_text;
