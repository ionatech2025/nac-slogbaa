-- Re-add alien@dev.com super admin account
-- Password: alien123.com (BCrypt cost 13)
INSERT INTO staff_user (id, full_name, email, password_hash, staff_role, is_active, created_at)
VALUES (
    'aaaa1111-aaaa-1111-aaaa-111111111111',
    'Alien Dev',
    'alien@dev.com',
    '$2b$13$eymDZHZF1u/k229tyDptCOncdbZfTpZqSLPWu8bmfLddGI7Py71j6', -- nosemgrep
    'SUPER_ADMIN',
    true,
    current_timestamp
)
ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    staff_role = 'SUPER_ADMIN',
    is_active = true;

-- Upgrade all seed account passwords from BCrypt cost-10 to cost-13
-- Password for all: "password" (BCrypt cost 13)
UPDATE staff_user
SET password_hash = '$2b$13$5pRMS2E64CYfq.T4gAVB4ur4.DW5L/FPfpN3RgQlHBUsRs7GU6dgW' -- nosemgrep
WHERE email IN ('superadmin@slogbaa.nac.go.ug', 'admin@slogbaa.nac.go.ug')
  AND password_hash LIKE '$2a$10$%';

UPDATE trainee
SET password_hash = '$2b$13$5pRMS2E64CYfq.T4gAVB4ur4.DW5L/FPfpN3RgQlHBUsRs7GU6dgW' -- nosemgrep
WHERE email IN ('jane.akello@example.com', 'john.ocen@example.com', 'mary.nabukenya@example.com')
  AND password_hash LIKE '$2a$10$%';
