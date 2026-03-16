CREATE TABLE course_review (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainee_id UUID NOT NULL REFERENCES trainee(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES course(id) ON DELETE CASCADE,
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    CONSTRAINT uq_course_review_trainee_course UNIQUE (trainee_id, course_id)
);
CREATE INDEX idx_course_review_course ON course_review(course_id);
