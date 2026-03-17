CREATE TABLE discussion_thread (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES course(id) ON DELETE CASCADE,
    module_id UUID REFERENCES module(id) ON DELETE CASCADE,
    author_id UUID NOT NULL,
    author_type VARCHAR(20) NOT NULL CHECK (author_type IN ('TRAINEE', 'STAFF')),
    title VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    is_resolved BOOLEAN NOT NULL DEFAULT false,
    reply_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp
);
CREATE INDEX idx_thread_course ON discussion_thread(course_id);
CREATE INDEX idx_thread_module ON discussion_thread(module_id);

CREATE TABLE discussion_reply (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES discussion_thread(id) ON DELETE CASCADE,
    author_id UUID NOT NULL,
    author_type VARCHAR(20) NOT NULL CHECK (author_type IN ('TRAINEE', 'STAFF')),
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp
);
CREATE INDEX idx_reply_thread ON discussion_reply(thread_id);
