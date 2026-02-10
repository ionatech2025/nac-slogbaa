-- ---------------------------------------------------------------------------
-- Seed sample data for development and testing
-- Uses fixed UUIDs for predictable cross-table references
-- ---------------------------------------------------------------------------

-- Staff users (no dependencies). Password for all seed accounts: password
-- BCrypt hash for "password" (cost 10):
INSERT INTO staff_user (id, full_name, email, password_hash, staff_role, is_active, created_at) VALUES
('11111111-1111-1111-1111-111111111101', 'Super Admin User', 'superadmin@slogbaa.nac.go.ug', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'SUPER_ADMIN', true, current_timestamp - INTERVAL '30 days'),
('11111111-1111-1111-1111-111111111102', 'Admin User', 'admin@slogbaa.nac.go.ug', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', true, current_timestamp - INTERVAL '20 days');

-- Trainees. Password for all: password
INSERT INTO trainee (id, first_name, last_name, email, password_hash, street, city, postal_code, gender, district_name, region, trainee_category, is_active, registration_date, email_verified, created_at, updated_at) VALUES
('22222222-2222-2222-2222-222222222201', 'Jane', 'Akello', 'jane.akello@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Plot 10 Main St', 'Kampala', '256', 'FEMALE', 'Kampala', 'Central', 'LEADER', true, current_date - 45, true, current_timestamp - INTERVAL '45 days', current_timestamp),
('22222222-2222-2222-2222-222222222202', 'John', 'Ocen', 'john.ocen@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Church Road', 'Gulu', '414', 'MALE', 'Gulu', 'Northern', 'CIVIL_SOCIETY_MEMBER', true, current_date - 30, true, current_timestamp - INTERVAL '30 days', current_timestamp),
('22222222-2222-2222-2222-222222222203', 'Mary', 'Nabukenya', 'mary.nabukenya@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL, 'Masaka', NULL, 'FEMALE', 'Masaka', 'Central', 'COMMUNITY_MEMBER', true, current_date - 14, false, current_timestamp - INTERVAL '14 days', current_timestamp);

-- Course (depends: staff_user)
INSERT INTO course (id, title, description, is_published, created_by, created_at, updated_at) VALUES
('33333333-3333-3333-3333-333333333301', 'Introduction to Civic Engagement', 'Foundational course on civic participation and community leadership for youth across Uganda.', true, '11111111-1111-1111-1111-111111111101', current_timestamp - INTERVAL '60 days', current_timestamp),
('33333333-3333-3333-3333-333333333302', 'Digital Literacy for Leaders', 'Building digital skills for effective communication and advocacy.', false, '11111111-1111-1111-1111-111111111101', current_timestamp - INTERVAL '20 days', current_timestamp);

-- Modules (depend: course)
INSERT INTO module (id, course_id, title, description, module_order, has_quiz, created_at, updated_at) VALUES
('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333301', 'What is Civic Engagement?', 'Understanding your role in society.', 1, true, current_timestamp, current_timestamp),
('44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333301', 'Community Leadership', 'Skills for leading at the local level.', 2, true, current_timestamp, current_timestamp),
('44444444-4444-4444-4444-444444444403', '33333333-3333-3333-3333-333333333301', 'Taking Action', 'From ideas to impact.', 3, false, current_timestamp, current_timestamp);

-- Content blocks (depend: module)
INSERT INTO content_block (id, module_id, block_type, block_order, rich_text, created_at, updated_at) VALUES
('55555555-5555-5555-5555-555555555501', '44444444-4444-4444-4444-444444444401', 'TEXT', 1, '<p>Civic engagement means working to make a difference in the life of our communities.</p>', current_timestamp, current_timestamp),
('55555555-5555-5555-5555-555555555502', '44444444-4444-4444-4444-444444444401', 'TEXT', 2, '<p>This module introduces key concepts and why they matter for Ugandan youth.</p>', current_timestamp, current_timestamp),
('55555555-5555-5555-5555-555555555503', '44444444-4444-4444-4444-444444444402', 'TEXT', 1, '<p>Community leaders listen, collaborate, and inspire action.</p>', current_timestamp, current_timestamp);

-- Library resources (depend: staff_user)
INSERT INTO library_resource (id, title, description, resource_type, file_url, file_size, file_type, uploaded_by, uploaded_at, is_published, created_at, updated_at) VALUES
('66666666-6666-6666-6666-666666666601', 'NAC Youth Engagement Policy', 'Official policy document on youth engagement.', 'POLICY_DOCUMENT', '/uploads/docs/nac-youth-policy.pdf', 524288, 'PDF', '11111111-1111-1111-1111-111111111101', current_timestamp - INTERVAL '50 days', true, current_timestamp - INTERVAL '50 days', current_timestamp),
('66666666-6666-6666-6666-666666666602', 'SLOGBAA Programme Overview', 'Reading material describing the SLOGBAA initiative.', 'READING_MATERIAL', '/uploads/docs/slogbaa-overview.pdf', 102400, 'PDF', '11111111-1111-1111-1111-111111111101', current_timestamp - INTERVAL '40 days', true, current_timestamp - INTERVAL '40 days', current_timestamp);

-- Quiz (depends: module) – for first module
INSERT INTO quiz (id, module_id, title, pass_threshold_percent, max_attempts, time_limit_minutes, created_at, updated_at) VALUES
('77777777-7777-7777-7777-777777777701', '44444444-4444-4444-4444-444444444401', 'Civic Engagement Basics Quiz', 70, 3, 15, current_timestamp, current_timestamp),
('77777777-7777-7777-7777-777777777702', '44444444-4444-4444-4444-444444444402', 'Community Leadership Quiz', 70, NULL, 20, current_timestamp, current_timestamp);

-- Questions (depend: quiz)
INSERT INTO question (id, quiz_id, question_text, question_type, points, question_order, created_at, updated_at) VALUES
('88888888-8888-8888-8888-888888888801', '77777777-7777-7777-7777-777777777701', 'What is civic engagement?', 'MULTIPLE_CHOICE', 10, 1, current_timestamp, current_timestamp),
('88888888-8888-8888-8888-888888888802', '77777777-7777-7777-7777-777777777701', 'Active participation strengthens democracy.', 'TRUE_FALSE', 5, 2, current_timestamp, current_timestamp),
('88888888-8888-8888-8888-888888888803', '77777777-7777-7777-7777-777777777701', 'Name one way youth can engage in their community.', 'SHORT_ANSWER', 10, 3, current_timestamp, current_timestamp);

-- Quiz options (depend: question)
INSERT INTO quiz_option (id, question_id, option_text, is_correct, option_order, created_at, updated_at) VALUES
('99999999-9999-9999-9999-999999999901', '88888888-8888-8888-8888-888888888801', 'Working to improve one''s community', true, 1, current_timestamp, current_timestamp),
('99999999-9999-9999-9999-999999999902', '88888888-8888-8888-8888-888888888801', 'Only voting in elections', false, 2, current_timestamp, current_timestamp),
('99999999-9999-9999-9999-999999999903', '88888888-8888-8888-8888-888888888801', 'Avoiding public discussions', false, 3, current_timestamp, current_timestamp),
('99999999-9999-9999-9999-999999999904', '88888888-8888-8888-8888-888888888802', 'True', true, 1, current_timestamp, current_timestamp),
('99999999-9999-9999-9999-999999999905', '88888888-8888-8888-8888-888888888802', 'False', false, 2, current_timestamp, current_timestamp);

-- Homepage content (depends: staff_user)
INSERT INTO homepage_content (id, last_updated_by, last_updated_at, whatsapp_url, facebook_url, twitter_url, created_at, updated_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01', '11111111-1111-1111-1111-111111111101', current_timestamp - INTERVAL '7 days', 'https://wa.me/256700000000', 'https://facebook.com/slogbaa', 'https://twitter.com/slogbaa', current_timestamp - INTERVAL '90 days', current_timestamp);

-- Banner images (depend: homepage_content)
INSERT INTO banner_image (id, homepage_content_id, image_url, alt_text, display_order, is_active, uploaded_at, created_at, updated_at) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01', '/images/banners/youth-engagement.jpg', 'Youth engagement in community', 1, true, current_timestamp - INTERVAL '7 days', current_timestamp, current_timestamp),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01', '/images/banners/training-workshop.jpg', 'SLOGBAA training workshop', 2, true, current_timestamp - INTERVAL '7 days', current_timestamp, current_timestamp);

-- Impact stories (depend: homepage_content)
INSERT INTO impact_story (id, homepage_content_id, title, summary, full_story, image_url, is_published, view_count, published_at, created_at, updated_at) VALUES
('cccccccc-cccc-cccc-cccc-cccccccccc01', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01', 'From Trainee to Community Leader', 'How Jane transformed her village through civic action.', '<p>Jane completed the SLOGBAA programme and went on to lead a local initiative that improved access to clean water for 500 households.</p>', '/images/stories/jane-story.jpg', true, 120, current_timestamp - INTERVAL '30 days', current_timestamp - INTERVAL '35 days', current_timestamp);

-- News updates (depend: homepage_content)
INSERT INTO news_update (id, homepage_content_id, title, content, is_published, published_at, created_at, updated_at) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddd01', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01', 'New Cohort Opens for Central Region', 'Registration for the next SLOGBAA cohort in the Central region is now open. Apply by end of month.', true, current_timestamp - INTERVAL '5 days', current_timestamp - INTERVAL '5 days', current_timestamp);

-- Video content (depend: homepage_content)
INSERT INTO video_content (id, homepage_content_id, title, youtube_url, youtube_video_id, display_order, added_at, created_at, updated_at) VALUES
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01', 'Welcome to SLOGBAA', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 1, current_timestamp - INTERVAL '14 days', current_timestamp, current_timestamp);

-- Partner logos (depend: homepage_content)
INSERT INTO partner_logo (id, homepage_content_id, partner_name, logo_url, alt_text, display_order, is_active, added_at, created_at, updated_at) VALUES
('ffffffff-ffff-ffff-ffff-ffffffff0001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01', 'NAC', '/images/partners/nac-logo.png', 'NAC logo', 1, true, current_timestamp - INTERVAL '90 days', current_timestamp, current_timestamp);

-- Live session (depends: course, module, staff_user)
INSERT INTO live_session (id, title, description, course_id, module_id, scheduled_date_time, duration_minutes, time_zone, platform, meeting_url, meeting_id, created_by, max_attendees, status, created_at, updated_at) VALUES
('10101010-1010-1010-1010-101010101001', 'Q&A: Civic Engagement in Practice', 'Live Q&A with facilitators.', '33333333-3333-3333-3333-333333333301', '44444444-4444-4444-4444-444444444402', current_timestamp + INTERVAL '7 days', 60, 'Africa/Kampala', 'ZOOM', 'https://zoom.us/j/123456789', '123456789', '11111111-1111-1111-1111-111111111101', 100, 'SCHEDULED', current_timestamp, current_timestamp);

-- Trainee assessment + quiz attempt (depend: trainee, quiz, module)
INSERT INTO trainee_assessment (id, trainee_id, quiz_id, module_id, created_at, updated_at) VALUES
('20202020-2020-2020-2020-202020202001', '22222222-2222-2222-2222-222222222201', '77777777-7777-7777-7777-777777777701', '44444444-4444-4444-4444-444444444401', current_timestamp - INTERVAL '10 days', current_timestamp);

INSERT INTO quiz_attempt (id, trainee_assessment_id, attempt_number, points_earned, total_points, is_passed, started_at, completed_at, created_at, updated_at) VALUES
('30303030-3030-3030-3030-303030303001', '20202020-2020-2020-2020-202020202001', 1, 25, 25, true, current_timestamp - INTERVAL '10 days', current_timestamp - INTERVAL '10 days' + INTERVAL '8 minutes', current_timestamp, current_timestamp);

INSERT INTO quiz_answer (id, quiz_attempt_id, question_id, selected_option_id, text_answer, is_correct, points_awarded, created_at) VALUES
('40404040-4040-4040-4040-404040404001', '30303030-3030-3030-3030-303030303001', '88888888-8888-8888-8888-888888888801', '99999999-9999-9999-9999-999999999901', NULL, true, 10, current_timestamp),
('40404040-4040-4040-4040-404040404002', '30303030-3030-3030-3030-303030303001', '88888888-8888-8888-8888-888888888802', '99999999-9999-9999-9999-999999999904', NULL, true, 5, current_timestamp),
('40404040-4040-4040-4040-404040404003', '30303030-3030-3030-3030-303030303001', '88888888-8888-8888-8888-888888888803', NULL, 'Volunteering at a community project', true, 10, current_timestamp);

-- Certificate (depends: trainee, course)
INSERT INTO certificate (id, trainee_id, course_id, certificate_number, issued_date, final_score_percent, certificate_template_version, layout_type, verification_code, file_url, email_sent_at, is_revoked, created_at, updated_at) VALUES
('50505050-5050-5050-5050-505050505001', '22222222-2222-2222-2222-222222222202', '33333333-3333-3333-3333-333333333301', 'SLOGBA-2026-0001', current_date - 5, 85, 'v1', 'STANDARD', 'verify-seed-2026-0001', '/certificates/SLOGBA-2026-0001.pdf', current_timestamp - INTERVAL '5 days', false, current_timestamp - INTERVAL '5 days', current_timestamp);

-- Trainee progress (depends: trainee, course, module, content_block)
INSERT INTO trainee_progress (id, trainee_id, course_id, enrollment_date, status, completion_percentage, last_module_id, last_content_block_id, last_accessed_at, created_at, updated_at) VALUES
('60606060-6060-6060-6060-606060606001', '22222222-2222-2222-2222-222222222201', '33333333-3333-3333-3333-333333333301', current_date - 40, 'IN_PROGRESS', 33, '44444444-4444-4444-4444-444444444402', '55555555-5555-5555-5555-555555555503', current_timestamp - INTERVAL '1 hour', current_timestamp - INTERVAL '40 days', current_timestamp),
('60606060-6060-6060-6060-606060606002', '22222222-2222-2222-2222-222222222202', '33333333-3333-3333-3333-333333333301', current_date - 25, 'COMPLETED', 100, '44444444-4444-4444-4444-444444444403', NULL, current_timestamp - INTERVAL '5 days', current_timestamp - INTERVAL '25 days', current_timestamp),
('60606060-6060-6060-6060-606060606003', '22222222-2222-2222-2222-222222222203', '33333333-3333-3333-3333-333333333301', current_date - 10, 'IN_PROGRESS', 0, '44444444-4444-4444-4444-444444444401', '55555555-5555-5555-5555-555555555501', current_timestamp - INTERVAL '2 days', current_timestamp - INTERVAL '10 days', current_timestamp);

-- Completion records (depend: trainee_progress)
INSERT INTO completion_record (id, trainee_progress_id, record_type, reference_id, completed_at, time_spent_minutes, created_at) VALUES
('70707070-7070-7070-7070-707070707001', '60606060-6060-6060-6060-606060606001', 'MODULE', '44444444-4444-4444-4444-444444444401', current_timestamp - INTERVAL '10 days', 45, current_timestamp),
('70707070-7070-7070-7070-707070707002', '60606060-6060-6060-6060-606060606002', 'MODULE', '44444444-4444-4444-4444-444444444401', current_timestamp - INTERVAL '20 days', 50, current_timestamp),
('70707070-7070-7070-7070-707070707003', '60606060-6060-6060-6060-606060606002', 'MODULE', '44444444-4444-4444-4444-444444444402', current_timestamp - INTERVAL '18 days', 55, current_timestamp),
('70707070-7070-7070-7070-707070707004', '60606060-6060-6060-6060-606060606002', 'MODULE', '44444444-4444-4444-4444-444444444403', current_timestamp - INTERVAL '5 days', 40, current_timestamp);

-- Module progress (depend: trainee_progress, module)
INSERT INTO module_progress (id, trainee_progress_id, module_id, status, started_at, completed_at, quiz_status, created_at, updated_at) VALUES
('80808080-8080-8080-8080-808080808001', '60606060-6060-6060-6060-606060606001', '44444444-4444-4444-4444-444444444401', 'COMPLETED', current_timestamp - INTERVAL '35 days', current_timestamp - INTERVAL '10 days', 'PASSED', current_timestamp, current_timestamp),
('80808080-8080-8080-8080-808080808002', '60606060-6060-6060-6060-606060606001', '44444444-4444-4444-4444-444444444402', 'IN_PROGRESS', current_timestamp - INTERVAL '9 days', NULL, 'NOT_ATTEMPTED', current_timestamp, current_timestamp),
('80808080-8080-8080-8080-808080808003', '60606060-6060-6060-6060-606060606001', '44444444-4444-4444-4444-444444444403', 'NOT_STARTED', NULL, NULL, 'NOT_ATTEMPTED', current_timestamp, current_timestamp),
('80808080-8080-8080-8080-808080808004', '60606060-6060-6060-6060-606060606003', '44444444-4444-4444-4444-444444444401', 'IN_PROGRESS', current_timestamp - INTERVAL '10 days', NULL, 'NOT_ATTEMPTED', current_timestamp, current_timestamp);

-- Session attendees (depend: live_session, trainee)
INSERT INTO session_attendee (id, live_session_id, trainee_id, registered_at, created_at, updated_at) VALUES
('90909090-9090-9090-9090-909090909001', '10101010-1010-1010-1010-101010101001', '22222222-2222-2222-2222-222222222201', current_timestamp - INTERVAL '2 days', current_timestamp, current_timestamp),
('90909090-9090-9090-9090-909090909002', '10101010-1010-1010-1010-101010101001', '22222222-2222-2222-2222-222222222202', current_timestamp - INTERVAL '1 day', current_timestamp, current_timestamp);

-- Analytics snapshot (read model, no FKs)
INSERT INTO analytics_snapshot (id, snapshot_date, generated_at, total_visitors, total_registered_trainees, trainees_in_progress, graduated_trainees, failed_trainees, target_progress, created_at) VALUES
('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', current_date - 1, current_timestamp - INTERVAL '1 day', 1250, 3, 2, 1, 0, 30000, current_timestamp - INTERVAL '1 day');

-- Demographic stats (depend: analytics_snapshot)
INSERT INTO demographic_stat (id, analytics_snapshot_id, dimension, breakdown_values, created_at) VALUES
('b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'GENDER', '{"MALE": 1, "FEMALE": 2}', current_timestamp),
('b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b2', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'CATEGORY', '{"LEADER": 1, "CIVIL_SOCIETY_MEMBER": 1, "COMMUNITY_MEMBER": 1}', current_timestamp),
('b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b3', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'DISTRICT', '{"Kampala": 1, "Gulu": 1, "Masaka": 1}', current_timestamp);
