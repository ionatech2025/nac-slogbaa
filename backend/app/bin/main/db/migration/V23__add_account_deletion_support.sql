-- V23: Add soft-delete columns for GDPR-compliant trainee account deletion
ALTER TABLE trainee ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE trainee ADD COLUMN IF NOT EXISTS deletion_reason VARCHAR(500);
