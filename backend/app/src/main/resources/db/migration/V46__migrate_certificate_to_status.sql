-- Migrate certificate table from is_revoked boolean to status enum-like string
ALTER TABLE certificate ADD COLUMN status VARCHAR(20);

-- Update status based on is_revoked
UPDATE certificate SET status = 'REVOKED' WHERE is_revoked = true;
UPDATE certificate SET status = 'ISSUED' WHERE is_revoked = false OR is_revoked IS NULL;

-- Make status NOT NULL and set default
ALTER TABLE certificate ALTER COLUMN status SET NOT NULL;
ALTER TABLE certificate ALTER COLUMN status SET DEFAULT 'ISSUED';

-- Remove is_revoked column
ALTER TABLE certificate DROP COLUMN is_revoked;
