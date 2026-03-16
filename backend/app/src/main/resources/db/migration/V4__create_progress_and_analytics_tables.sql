-- ---------------------------------------------------------------------------
-- Progress & Analytics Context
-- TraineeProgress, CompletionRecord, ModuleProgress, AnalyticsSnapshot
-- ---------------------------------------------------------------------------

CREATE TABLE trainee_progress (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainee_id              UUID NOT NULL REFERENCES trainee (id) ON DELETE CASCADE,
    course_id               UUID NOT NULL REFERENCES course (id) ON DELETE CASCADE,
    enrollment_date         DATE NOT NULL DEFAULT current_date,
    status                  VARCHAR(30) NOT NULL CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'FAILED')),
    completion_percentage   INT NOT NULL DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    last_module_id          UUID REFERENCES module (id),
    last_content_block_id   UUID REFERENCES content_block (id),
    last_accessed_at       TIMESTAMP WITH TIME ZONE,
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    CONSTRAINT uq_trainee_progress_trainee_course UNIQUE (trainee_id, course_id)
);

CREATE INDEX idx_trainee_progress_trainee ON trainee_progress (trainee_id);
CREATE INDEX idx_trainee_progress_course ON trainee_progress (course_id);
CREATE INDEX idx_trainee_progress_status ON trainee_progress (status);

-- ---------------------------------------------------------------------------

CREATE TABLE completion_record (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainee_progress_id     UUID NOT NULL REFERENCES trainee_progress (id) ON DELETE CASCADE,
    record_type             VARCHAR(30) NOT NULL CHECK (record_type IN ('MODULE', 'QUIZ', 'CONTENT_BLOCK')),
    reference_id            UUID NOT NULL,
    completed_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    time_spent_minutes      INT,
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE INDEX idx_completion_record_progress ON completion_record (trainee_progress_id);
CREATE INDEX idx_completion_record_type ON completion_record (record_type);

-- ---------------------------------------------------------------------------

CREATE TABLE module_progress (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainee_progress_id     UUID NOT NULL REFERENCES trainee_progress (id) ON DELETE CASCADE,
    module_id               UUID NOT NULL REFERENCES module (id) ON DELETE CASCADE,
    status                  VARCHAR(30) NOT NULL CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED')),
    started_at              TIMESTAMP WITH TIME ZONE,
    completed_at            TIMESTAMP WITH TIME ZONE,
    quiz_status             VARCHAR(30) NOT NULL DEFAULT 'NOT_ATTEMPTED' CHECK (quiz_status IN ('NOT_ATTEMPTED', 'ATTEMPTED', 'PASSED')),
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    CONSTRAINT uq_module_progress_progress_module UNIQUE (trainee_progress_id, module_id)
);

CREATE INDEX idx_module_progress_trainee_progress ON module_progress (trainee_progress_id);
CREATE INDEX idx_module_progress_module ON module_progress (module_id);

-- ---------------------------------------------------------------------------
-- Analytics read model (CQRS)
-- ---------------------------------------------------------------------------

CREATE TABLE analytics_snapshot (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    snapshot_date           DATE NOT NULL,
    generated_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    total_visitors          INT NOT NULL DEFAULT 0,
    total_registered_trainees INT NOT NULL DEFAULT 0,
    trainees_in_progress    INT NOT NULL DEFAULT 0,
    graduated_trainees      INT NOT NULL DEFAULT 0,
    failed_trainees         INT NOT NULL DEFAULT 0,
    target_progress         INT NOT NULL DEFAULT 0,
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE INDEX idx_analytics_snapshot_date ON analytics_snapshot (snapshot_date);

-- ---------------------------------------------------------------------------

CREATE TABLE demographic_stat (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analytics_snapshot_id   UUID NOT NULL REFERENCES analytics_snapshot (id) ON DELETE CASCADE,
    dimension               VARCHAR(30) NOT NULL CHECK (dimension IN ('GENDER', 'DISTRICT', 'CATEGORY')),
    breakdown_values        JSONB NOT NULL DEFAULT '{}',
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE INDEX idx_demographic_stat_snapshot ON demographic_stat (analytics_snapshot_id);
