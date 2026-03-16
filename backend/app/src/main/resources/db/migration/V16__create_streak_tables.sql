CREATE TABLE daily_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainee_id UUID NOT NULL REFERENCES trainee(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    minutes_spent INT NOT NULL DEFAULT 0,
    modules_completed INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    CONSTRAINT uq_daily_activity_trainee_date UNIQUE (trainee_id, activity_date)
);
CREATE INDEX idx_daily_activity_trainee ON daily_activity(trainee_id);

CREATE TABLE trainee_streak (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainee_id UUID NOT NULL REFERENCES trainee(id) ON DELETE CASCADE,
    current_streak INT NOT NULL DEFAULT 0,
    longest_streak INT NOT NULL DEFAULT 0,
    last_active_date DATE,
    daily_goal_minutes INT NOT NULL DEFAULT 5,
    created_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    CONSTRAINT uq_trainee_streak UNIQUE (trainee_id)
);
