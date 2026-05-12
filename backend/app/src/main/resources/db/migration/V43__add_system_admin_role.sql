ALTER TABLE staff_user DROP CONSTRAINT staff_user_staff_role_check;
ALTER TABLE staff_user ADD CONSTRAINT staff_user_staff_role_check CHECK (staff_role IN ('SYSTEM_ADMIN', 'SUPER_ADMIN', 'ADMIN'));

CREATE TABLE admin_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID NOT NULL REFERENCES staff_user(id),
    actor_email VARCHAR(255) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    target_id VARCHAR(255),
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE INDEX idx_admin_activity_log_actor ON admin_activity_log(actor_id);
CREATE INDEX idx_admin_activity_log_created_at ON admin_activity_log(created_at DESC);
