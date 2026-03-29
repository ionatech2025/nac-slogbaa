-- Staff-authored course reviews (separate from trainee reviews)
CREATE TABLE course_staff_review (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_user_id UUID NOT NULL REFERENCES staff_user(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES course(id) ON DELETE CASCADE,
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    CONSTRAINT uq_course_staff_review UNIQUE (staff_user_id, course_id)
);
CREATE INDEX idx_course_staff_review_course ON course_staff_review(course_id);

-- Allow in-app notifications for staff (trainee_id XOR staff_user_id)
ALTER TABLE notification ADD COLUMN staff_user_id UUID REFERENCES staff_user(id) ON DELETE CASCADE;
ALTER TABLE notification ALTER COLUMN trainee_id DROP NOT NULL;
ALTER TABLE notification ADD CONSTRAINT ck_notification_recipient CHECK (
    (trainee_id IS NOT NULL AND staff_user_id IS NULL)
    OR (trainee_id IS NULL AND staff_user_id IS NOT NULL)
);
CREATE INDEX idx_notification_staff ON notification(staff_user_id, is_read, created_at DESC);
