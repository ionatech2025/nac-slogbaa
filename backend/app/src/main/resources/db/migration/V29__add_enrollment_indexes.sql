-- Enrollment query performance (AdminCourseManagementController)
CREATE INDEX IF NOT EXISTS idx_trainee_progress_course_enrollment
    ON trainee_progress (course_id, enrollment_date DESC);

-- Module progress batch lookup
CREATE INDEX IF NOT EXISTS idx_module_progress_trainee_progress_status
    ON module_progress (trainee_progress_id, status);
