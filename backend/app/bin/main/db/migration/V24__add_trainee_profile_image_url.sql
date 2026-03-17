-- V24: Add profile_image_url column for trainee self-service avatar upload
ALTER TABLE trainee ADD COLUMN IF NOT EXISTS profile_image_url VARCHAR(500);
