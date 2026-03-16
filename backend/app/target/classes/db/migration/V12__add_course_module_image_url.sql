-- Add image_url to course and module for card/thumbnail display
-- Stored as URL path (e.g. /uploads/courses/abc.jpg), not binary

ALTER TABLE course ADD COLUMN image_url VARCHAR(2048);
ALTER TABLE module ADD COLUMN image_url VARCHAR(2048);
