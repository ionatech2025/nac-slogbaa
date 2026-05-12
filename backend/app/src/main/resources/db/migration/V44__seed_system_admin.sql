INSERT INTO staff_user
(id, full_name, email, password_hash, staff_role, is_active)
VALUES
(gen_random_uuid(), 'System Admin', 'systemadmin@slogbaa.nac.go.ug', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'SYSTEM_ADMIN', true);

