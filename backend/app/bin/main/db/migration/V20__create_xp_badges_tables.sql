-- XP & Badge System (Khan Academy-style achievements)

CREATE TABLE badge_definition (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    icon_name VARCHAR(50) NOT NULL,
    trigger_type VARCHAR(50) NOT NULL,
    xp_reward INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp
);

CREATE TABLE trainee_badge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainee_id UUID NOT NULL REFERENCES trainee(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badge_definition(id) ON DELETE CASCADE,
    awarded_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    CONSTRAINT uq_trainee_badge UNIQUE (trainee_id, badge_id)
);

CREATE INDEX idx_trainee_badge_trainee ON trainee_badge(trainee_id);

CREATE TABLE trainee_xp (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainee_id UUID NOT NULL REFERENCES trainee(id) ON DELETE CASCADE,
    total_xp INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    CONSTRAINT uq_trainee_xp UNIQUE (trainee_id)
);

INSERT INTO badge_definition (name, description, icon_name, trigger_type, xp_reward) VALUES
    ('First Steps', 'Enrolled in your first course', 'BookOpen', 'FIRST_ENROLLMENT', 10),
    ('Graduate', 'Completed your first course', 'GraduationCap', 'FIRST_COMPLETION', 50),
    ('Week Warrior', '7-day learning streak', 'Flame', 'STREAK_7', 100),
    ('Monthly Master', '30-day learning streak', 'Flame', 'STREAK_30', 500),
    ('Scholar', 'Completed 3 courses', 'Award', 'COURSES_COMPLETED_3', 150),
    ('Expert', 'Completed 5 courses', 'Trophy', 'COURSES_COMPLETED_5', 300),
    ('Perfect Score', '100% on a quiz', 'Star', 'PERFECT_QUIZ', 75),
    ('Reviewer', 'Wrote your first review', 'MessageSquare', 'REVIEW_WRITTEN', 25);
