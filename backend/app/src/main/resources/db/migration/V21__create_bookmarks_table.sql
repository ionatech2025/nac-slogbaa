CREATE TABLE trainee_bookmark (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainee_id UUID NOT NULL REFERENCES trainee(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES course(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES module(id) ON DELETE CASCADE,
    content_block_id UUID,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp
);
CREATE INDEX idx_bookmark_trainee ON trainee_bookmark(trainee_id);
CREATE INDEX idx_bookmark_course ON trainee_bookmark(course_id);
CREATE UNIQUE INDEX idx_bookmark_unique ON trainee_bookmark(trainee_id, course_id, module_id, content_block_id);
