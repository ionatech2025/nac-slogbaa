-- ---------------------------------------------------------------------------
-- Assessment & Certification Context
-- Quiz, Question, Option, TraineeAssessment, QuizAttempt, Certificate
-- ---------------------------------------------------------------------------

CREATE TABLE quiz (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id               UUID NOT NULL REFERENCES module (id) ON DELETE CASCADE,
    title                   VARCHAR(500) NOT NULL,
    pass_threshold_percent  INT NOT NULL DEFAULT 70 CHECK (pass_threshold_percent >= 0 AND pass_threshold_percent <= 100),
    max_attempts            INT,
    time_limit_minutes      INT,
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    CONSTRAINT uq_quiz_module UNIQUE (module_id)
);

CREATE INDEX idx_quiz_module ON quiz (module_id);

-- ---------------------------------------------------------------------------

CREATE TABLE question (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id         UUID NOT NULL REFERENCES quiz (id) ON DELETE CASCADE,
    question_text   TEXT NOT NULL,
    question_type   VARCHAR(30) NOT NULL CHECK (question_type IN ('MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER', 'ESSAY')),
    points          INT NOT NULL DEFAULT 1,
    question_order  INT NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE INDEX idx_question_quiz ON question (quiz_id);

-- ---------------------------------------------------------------------------

CREATE TABLE quiz_option (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id     UUID NOT NULL REFERENCES question (id) ON DELETE CASCADE,
    option_text     TEXT NOT NULL,
    is_correct      BOOLEAN NOT NULL DEFAULT false,
    option_order    INT NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE INDEX idx_quiz_option_question ON quiz_option (question_id);

-- ---------------------------------------------------------------------------

CREATE TABLE trainee_assessment (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainee_id      UUID NOT NULL REFERENCES trainee (id) ON DELETE CASCADE,
    quiz_id         UUID NOT NULL REFERENCES quiz (id) ON DELETE CASCADE,
    module_id       UUID NOT NULL REFERENCES module (id),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    CONSTRAINT uq_trainee_assessment_trainee_quiz UNIQUE (trainee_id, quiz_id)
);

CREATE INDEX idx_trainee_assessment_trainee ON trainee_assessment (trainee_id);
CREATE INDEX idx_trainee_assessment_quiz ON trainee_assessment (quiz_id);

-- ---------------------------------------------------------------------------

CREATE TABLE quiz_attempt (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainee_assessment_id   UUID NOT NULL REFERENCES trainee_assessment (id) ON DELETE CASCADE,
    attempt_number          INT NOT NULL,
    points_earned           INT NOT NULL DEFAULT 0,
    total_points            INT NOT NULL DEFAULT 0,
    is_passed               BOOLEAN NOT NULL DEFAULT false,
    started_at              TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at            TIMESTAMP WITH TIME ZONE,
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE INDEX idx_quiz_attempt_assessment ON quiz_attempt (trainee_assessment_id);

-- ---------------------------------------------------------------------------

CREATE TABLE quiz_answer (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_attempt_id     UUID NOT NULL REFERENCES quiz_attempt (id) ON DELETE CASCADE,
    question_id         UUID NOT NULL REFERENCES question (id),
    selected_option_id  UUID REFERENCES quiz_option (id),
    text_answer         TEXT,
    is_correct          BOOLEAN NOT NULL DEFAULT false,
    points_awarded      INT NOT NULL DEFAULT 0,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE INDEX idx_quiz_answer_attempt ON quiz_answer (quiz_attempt_id);

-- ---------------------------------------------------------------------------

CREATE TABLE certificate (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainee_id                   UUID NOT NULL REFERENCES trainee (id) ON DELETE CASCADE,
    course_id                    UUID NOT NULL REFERENCES course (id) ON DELETE CASCADE,
    certificate_number          VARCHAR(50) NOT NULL,
    issued_date                  DATE NOT NULL,
    final_score_percent          INT NOT NULL CHECK (final_score_percent >= 0 AND final_score_percent <= 100),
    certificate_template_version VARCHAR(50),
    layout_type                  VARCHAR(50),
    verification_code            VARCHAR(255) NOT NULL,
    file_url                     VARCHAR(2048),
    email_sent_at                TIMESTAMP WITH TIME ZONE,
    is_revoked                   BOOLEAN NOT NULL DEFAULT false,
    created_at                   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated_at                   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    CONSTRAINT uq_certificate_number UNIQUE (certificate_number),
    CONSTRAINT uq_certificate_verification UNIQUE (verification_code),
    CONSTRAINT uq_certificate_trainee_course UNIQUE (trainee_id, course_id)
);

CREATE INDEX idx_certificate_trainee ON certificate (trainee_id);
CREATE INDEX idx_certificate_course ON certificate (course_id);
CREATE INDEX idx_certificate_verification ON certificate (verification_code);
