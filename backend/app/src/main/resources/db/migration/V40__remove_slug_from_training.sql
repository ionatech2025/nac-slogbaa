-- V40: Remove slug column from in_person_training
ALTER TABLE in_person_training DROP COLUMN IF EXISTS slug;
