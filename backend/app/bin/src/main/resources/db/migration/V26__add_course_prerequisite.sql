-- V26: Add prerequisite course support for learning paths
ALTER TABLE course ADD COLUMN prerequisite_course_id UUID REFERENCES course(id);
CREATE INDEX idx_course_prerequisite ON course(prerequisite_course_id);
