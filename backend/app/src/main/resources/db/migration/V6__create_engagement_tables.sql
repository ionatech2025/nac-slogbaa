-- ---------------------------------------------------------------------------
-- Engagement & Communication Context
-- LiveSession, SessionAttendee
-- ---------------------------------------------------------------------------

CREATE TABLE live_session (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title               VARCHAR(500) NOT NULL,
    description         TEXT,
    course_id           UUID REFERENCES course (id) ON DELETE SET NULL,
    module_id           UUID REFERENCES module (id) ON DELETE SET NULL,
    scheduled_date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes    INT NOT NULL,
    time_zone           VARCHAR(100),
    reminder_sent_at    TIMESTAMP WITH TIME ZONE,
    platform            VARCHAR(30) NOT NULL CHECK (platform IN ('ZOOM', 'GOOGLE_MEET')),
    meeting_url         VARCHAR(2048),
    meeting_id          VARCHAR(255),
    meeting_password    VARCHAR(255),
    created_by          UUID NOT NULL REFERENCES staff_user (id),
    max_attendees       INT,
    status              VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE INDEX idx_live_session_course ON live_session (course_id);
CREATE INDEX idx_live_session_scheduled ON live_session (scheduled_date_time);
CREATE INDEX idx_live_session_status ON live_session (status);

-- ---------------------------------------------------------------------------

CREATE TABLE session_attendee (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    live_session_id     UUID NOT NULL REFERENCES live_session (id) ON DELETE CASCADE,
    trainee_id          UUID NOT NULL REFERENCES trainee (id) ON DELETE CASCADE,
    registered_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    joined_at           TIMESTAMP WITH TIME ZONE,
    left_at             TIMESTAMP WITH TIME ZONE,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    CONSTRAINT uq_session_attendee_session_trainee UNIQUE (live_session_id, trainee_id)
);

CREATE INDEX idx_session_attendee_session ON session_attendee (live_session_id);
CREATE INDEX idx_session_attendee_trainee ON session_attendee (trainee_id);
