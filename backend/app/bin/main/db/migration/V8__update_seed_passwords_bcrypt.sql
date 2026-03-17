-- Update seed account password hashes to valid BCrypt for "password" (cost 10).
-- Apply only if you previously ran V7 with placeholder hashes; safe to run multiple times.

UPDATE staff_user
SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE email IN ('superadmin@slogbaa.nac.go.ug', 'admin@slogbaa.nac.go.ug')
  AND (password_hash LIKE '$2a$10$placeholder%' OR password_hash NOT LIKE '$2a$10$N9qo%');

UPDATE trainee
SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE email IN ('jane.akello@example.com', 'john.ocen@example.com', 'mary.nabukenya@example.com')
  AND (password_hash LIKE '$2a$10$placeholder%' OR password_hash NOT LIKE '$2a$10$N9qo%');
