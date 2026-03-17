-- V24: In-app notification center
CREATE TABLE notification (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainee_id  UUID         NOT NULL REFERENCES trainee(id) ON DELETE CASCADE,
    type        VARCHAR(50)  NOT NULL,
    title       VARCHAR(255) NOT NULL,
    message     TEXT         NOT NULL,
    link        VARCHAR(500),
    is_read     BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notification_trainee ON notification(trainee_id, is_read, created_at DESC);
