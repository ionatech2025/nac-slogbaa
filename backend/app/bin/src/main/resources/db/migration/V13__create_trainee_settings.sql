-- Trainee settings for certificate email opt-in and other preferences
CREATE TABLE trainee_settings (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainee_id                  UUID NOT NULL REFERENCES trainee (id) ON DELETE CASCADE,
    certificate_email_opt_in    BOOLEAN NOT NULL DEFAULT false,
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    CONSTRAINT uq_trainee_settings_trainee UNIQUE (trainee_id)
);

CREATE INDEX idx_trainee_settings_trainee ON trainee_settings (trainee_id);
