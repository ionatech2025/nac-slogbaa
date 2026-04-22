-- V39: Simplify In-Person Training table to match News structure
ALTER TABLE in_person_training RENAME COLUMN excerpt TO summary;
ALTER TABLE in_person_training ADD COLUMN IF NOT EXISTS tag VARCHAR(255);

-- Dropping columns that are no longer needed after simplification
ALTER TABLE in_person_training DROP COLUMN IF EXISTS eyebrow;
ALTER TABLE in_person_training DROP COLUMN IF EXISTS facilitators;
ALTER TABLE in_person_training DROP COLUMN IF EXISTS tags;
ALTER TABLE in_person_training DROP COLUMN IF EXISTS intro;
ALTER TABLE in_person_training DROP COLUMN IF EXISTS content;
ALTER TABLE in_person_training DROP COLUMN IF EXISTS location;
