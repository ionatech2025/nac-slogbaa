-- ---------------------------------------------------------------------------
-- Learning Management Context
-- Course, Module, ContentBlock, LibraryResource aggregates
-- ---------------------------------------------------------------------------

CREATE TABLE course (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(500) NOT NULL,
    description     TEXT,
    is_published    BOOLEAN NOT NULL DEFAULT false,
    created_by      UUID NOT NULL REFERENCES staff_user (id),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE INDEX idx_course_published ON course (is_published) WHERE is_published = true;
CREATE INDEX idx_course_created_by ON course (created_by);

-- ---------------------------------------------------------------------------

CREATE TABLE module (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id       UUID NOT NULL REFERENCES course (id) ON DELETE CASCADE,
    title           VARCHAR(500) NOT NULL,
    description     TEXT,
    module_order    INT NOT NULL,
    has_quiz        BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    CONSTRAINT uq_module_course_order UNIQUE (course_id, module_order)
);

CREATE INDEX idx_module_course ON module (course_id);

-- ---------------------------------------------------------------------------

CREATE TABLE content_block (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id               UUID NOT NULL REFERENCES module (id) ON DELETE CASCADE,
    block_type              VARCHAR(30) NOT NULL CHECK (block_type IN ('TEXT', 'IMAGE', 'VIDEO', 'ACTIVITY')),
    block_order             INT NOT NULL,
    rich_text               TEXT,
    image_url               VARCHAR(2048),
    image_alt_text          VARCHAR(255),
    image_caption           VARCHAR(500),
    video_url               VARCHAR(2048),
    video_id                VARCHAR(50),
    activity_instructions   TEXT,
    activity_resources      TEXT,
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE INDEX idx_content_block_module ON content_block (module_id);

-- ---------------------------------------------------------------------------

CREATE TABLE library_resource (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(500) NOT NULL,
    description     TEXT,
    resource_type   VARCHAR(50) NOT NULL CHECK (resource_type IN ('DOCUMENT', 'POLICY_DOCUMENT', 'READING_MATERIAL')),
    file_url        VARCHAR(2048) NOT NULL,
    file_size       BIGINT,
    file_type       VARCHAR(50),
    uploaded_by     UUID NOT NULL REFERENCES staff_user (id),
    uploaded_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    is_published    BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE INDEX idx_library_resource_published ON library_resource (is_published) WHERE is_published = true;
CREATE INDEX idx_library_resource_type ON library_resource (resource_type);
