-- ---------------------------------------------------------------------------
-- Add course_id to library_resource for course-specific resources
-- ---------------------------------------------------------------------------

ALTER TABLE library_resource
ADD COLUMN course_id UUID REFERENCES course (id) ON DELETE SET NULL;

CREATE INDEX idx_library_resource_course ON library_resource (course_id);
