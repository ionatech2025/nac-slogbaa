-- Drop the foreign key constraint on staff_user(id)
ALTER TABLE admin_activity_log DROP CONSTRAINT IF EXISTS admin_activity_log_actor_id_fkey;

-- Allow actor_id to be NULL (for system actions)
ALTER TABLE admin_activity_log ALTER COLUMN actor_id DROP NOT NULL;
