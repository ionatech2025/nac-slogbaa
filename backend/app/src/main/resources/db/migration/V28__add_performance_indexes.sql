-- Performance indexes for hot query paths.
-- All use IF NOT EXISTS to be safely re-runnable.

-- Trainee progress: composite for enrollment lookups (trainee + course)
CREATE INDEX IF NOT EXISTS idx_trainee_progress_trainee_course
    ON trainee_progress (trainee_id, course_id);

-- Bookmarks: composite for "is this bookmarked?" checks
CREATE INDEX IF NOT EXISTS idx_bookmark_trainee_course
    ON trainee_bookmark (trainee_id, course_id);

-- Discussion threads: composite for course discussion listings sorted by date
CREATE INDEX IF NOT EXISTS idx_thread_course_created
    ON discussion_thread (course_id, created_at DESC);

-- Daily activity: composite for streak calculation queries
CREATE INDEX IF NOT EXISTS idx_daily_activity_trainee_date
    ON daily_activity (trainee_id, activity_date DESC);

-- Course reviews: composite for course review listings sorted by date
CREATE INDEX IF NOT EXISTS idx_course_review_course_created
    ON course_review (course_id, created_at DESC);
