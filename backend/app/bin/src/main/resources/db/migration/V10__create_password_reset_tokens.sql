-- ---------------------------------------------------------------------------
-- Password reset tokens (IAM)
-- ---------------------------------------------------------------------------

CREATE TABLE password_reset_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token       VARCHAR(255) NOT NULL,
    user_email  VARCHAR(255) NOT NULL,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    CONSTRAINT uq_password_reset_token UNIQUE (token)
);

CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens (token);
CREATE INDEX idx_password_reset_tokens_user_email ON password_reset_tokens (user_email);
CREATE INDEX idx_password_reset_tokens_expiry ON password_reset_tokens (expiry_date);
