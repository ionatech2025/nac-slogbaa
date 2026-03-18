-- ---------------------------------------------------------------------------
-- Email verification tokens (IAM)
-- ---------------------------------------------------------------------------

CREATE TABLE email_verification_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token       VARCHAR(255) NOT NULL,
    user_email  VARCHAR(255) NOT NULL,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    CONSTRAINT uq_email_verification_token UNIQUE (token)
);

CREATE INDEX idx_email_verification_tokens_token ON email_verification_tokens (token);
CREATE INDEX idx_email_verification_tokens_user_email ON email_verification_tokens (user_email);
CREATE INDEX idx_email_verification_tokens_expiry ON email_verification_tokens (expiry_date);
