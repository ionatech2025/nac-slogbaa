-- Live session: banner, agenda/details, speakers (JSON), meeting id/password; trainee registration

ALTER TABLE live_session
    ADD COLUMN IF NOT EXISTS banner_image_url TEXT,
    ADD COLUMN IF NOT EXISTS session_details TEXT,
    ADD COLUMN IF NOT EXISTS meeting_id VARCHAR(255),
    ADD COLUMN IF NOT EXISTS meeting_password VARCHAR(255),
    ADD COLUMN IF NOT EXISTS speakers_json TEXT;

CREATE TABLE IF NOT EXISTS live_session_registration (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    live_session_id   UUID NOT NULL REFERENCES live_session (id) ON DELETE CASCADE,
    trainee_id        UUID NOT NULL REFERENCES trainee (id) ON DELETE CASCADE,
    registered_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_live_session_registration UNIQUE (live_session_id, trainee_id)
);

CREATE INDEX IF NOT EXISTS idx_lsr_session ON live_session_registration (live_session_id);
CREATE INDEX IF NOT EXISTS idx_lsr_trainee ON live_session_registration (trainee_id);

-- Sample sessions (past + upcoming) — uses relative times so they stay meaningful after migrate
INSERT INTO live_session (
    id, title, description, provider, meeting_url, meeting_id, meeting_password,
    scheduled_at, duration_minutes, active,
    banner_image_url, session_details, speakers_json
) VALUES
(
    'a0000001-0000-4000-8000-000000000001',
    'Community Organizing 101',
    'Foundations of grassroots mobilisation and safe outreach.',
    'ZOOM',
    'https://zoom.us/j/10000000001',
    '100 0000 0001',
    'slogbaa-demo-1',
    NOW() - INTERVAL '14 days',
    90,
    true,
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200',
    E'What we covered:\n• Mapping stakeholders\n• Door-to-door basics\n• De-escalation tips',
    '[{"name":"Dr. Sarah Nalubega","role":"Senior Trainer","bio":"15 years supporting citizen-led initiatives across Uganda.","photoUrl":null}]'
),
(
    'a0000001-0000-4000-8000-000000000002',
    'Budget Advocacy Live Clinic',
    'Interactive clinic on tracking district budgets and FOIA-style requests.',
    'GOOGLE_MEET',
    'https://meet.google.com/lookup/demo-slogbaa-budget',
    'demo-slogbaa-budget',
    NULL,
    NOW() + INTERVAL '3 days',
    60,
    true,
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200',
    E'Agenda:\n• Live tool walkthrough\n• Breakout: your district case study\n• Q&A and next steps',
    '[{"name":"James Okello","role":"Policy Lead","bio":"Former district planner; focuses on fiscal transparency.","photoUrl":null},{"name":"Mary Akello","role":"Co-host","bio":"Civil society focal point, Eastern region.","photoUrl":null}]'
),
(
    'a0000001-0000-4000-8000-000000000003',
    'Digital Safety for Activists',
    'Hands-on setup for Signal, 2FA, and safer messaging on mobile.',
    'ZOOM',
    'https://zoom.us/j/10000000003',
    '100 0000 0003',
    'slogbaa-safety',
    NOW() + INTERVAL '10 days',
    75,
    true,
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200',
    E'Bring your smartphone. We will:\n• Install and verify Signal\n• Enable 2FA on email\n• Discuss device encryption options',
    '[{"name":"Alex Katuramu","role":"Security trainer","bio":"Independent infosec consultant for NGOs.","photoUrl":null}]'
)
ON CONFLICT (id) DO NOTHING;
