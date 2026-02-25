-- ---------------------------------------------------------------------------
-- Seed 10 more courses: mix of published/unpublished, with/without modules
-- created_by: Super Admin (11111111-1111-1111-1111-111111111101)
-- ---------------------------------------------------------------------------

-- Courses (id, title, description, is_published, created_by, created_at, updated_at)
INSERT INTO course (id, title, description, is_published, created_by, created_at, updated_at) VALUES
-- 1–2: published, with modules
('33333333-3333-3333-3333-333333333303', 'Budget Advocacy Basics', 'Understand local budgets and how to advocate for community priorities. Essential for leaders and civil society.', true, '11111111-1111-1111-1111-111111111101', current_timestamp - INTERVAL '55 days', current_timestamp),
('33333333-3333-3333-3333-333333333304', 'Youth and Governance', 'How young people can participate in governance and hold leaders accountable.', true, '11111111-1111-1111-1111-111111111101', current_timestamp - INTERVAL '45 days', current_timestamp),
-- 3: published, no modules yet
('33333333-3333-3333-3333-333333333305', 'Conflict Resolution in Communities', 'Practical skills for mediating and resolving conflicts at the community level. Content coming soon.', true, '11111111-1111-1111-1111-111111111101', current_timestamp - INTERVAL '30 days', current_timestamp),
-- 4–5: not published
('33333333-3333-3333-3333-333333333306', 'Advanced Advocacy Campaigns', 'Design and run effective advocacy campaigns. Draft course – not yet published.', false, '11111111-1111-1111-1111-111111111101', current_timestamp - INTERVAL '25 days', current_timestamp),
('33333333-3333-3333-3333-333333333307', 'Data for Decision Making', 'Using data and evidence in community and policy work. In development.', false, '11111111-1111-1111-1111-111111111101', current_timestamp - INTERVAL '14 days', current_timestamp),
-- 6–7: published
('33333333-3333-3333-3333-333333333308', 'Public Speaking for Leaders', 'Build confidence and skills to speak in public and represent your community.', true, '11111111-1111-1111-1111-111111111101', current_timestamp - INTERVAL '40 days', current_timestamp),
('33333333-3333-3333-3333-333333333309', 'Gender and Inclusive Participation', 'Why inclusive participation matters and how to foster it in your context.', true, '11111111-1111-1111-1111-111111111101', current_timestamp - INTERVAL '20 days', current_timestamp),
-- 8: not published, has modules (draft)
('33333333-3333-3333-3333-333333333310', 'Monitoring and Evaluation Basics', 'Introduction to M&E for community projects. Draft with one module.', false, '11111111-1111-1111-1111-111111111101', current_timestamp - INTERVAL '10 days', current_timestamp),
-- 9–10: one published with modules, one not published, no modules
('33333333-3333-3333-3333-333333333311', 'Networking and Partnerships', 'Building and sustaining partnerships for greater impact.', true, '11111111-1111-1111-1111-111111111101', current_timestamp - INTERVAL '35 days', current_timestamp),
('33333333-3333-3333-3333-333333333312', 'Ethics in Civic Leadership', 'Integrity and ethics when leading in the public space. Planned – no content yet.', false, '11111111-1111-1111-1111-111111111101', current_timestamp - INTERVAL '5 days', current_timestamp);

-- ---------------------------------------------------------------------------
-- Modules for courses that have them
-- ---------------------------------------------------------------------------

-- Budget Advocacy Basics (303): 2 modules
INSERT INTO module (id, course_id, title, description, module_order, has_quiz, created_at, updated_at) VALUES
('44444444-4444-4444-4444-444444444404', '33333333-3333-3333-3333-333333333303', 'Understanding the Budget', 'How public budgets work and where to find information.', 1, true, current_timestamp, current_timestamp),
('44444444-4444-4444-4444-444444444405', '33333333-3333-3333-3333-333333333303', 'Advocacy in Practice', 'Steps to advocate for budget priorities.', 2, false, current_timestamp, current_timestamp);

-- Youth and Governance (304): 1 module
INSERT INTO module (id, course_id, title, description, module_order, has_quiz, created_at, updated_at) VALUES
('44444444-4444-4444-4444-444444444406', '33333333-3333-3333-3333-333333333304', 'Your Role in Governance', 'Ways youth can engage in governance at local and national level.', 1, true, current_timestamp, current_timestamp);

-- Advanced Advocacy Campaigns (306) – not published: 3 modules
INSERT INTO module (id, course_id, title, description, module_order, has_quiz, created_at, updated_at) VALUES
('44444444-4444-4444-4444-444444444407', '33333333-3333-3333-3333-333333333306', 'Campaign Planning', 'Setting goals and strategy.', 1, true, current_timestamp, current_timestamp),
('44444444-4444-4444-4444-444444444408', '33333333-3333-3333-3333-333333333306', 'Messaging and Outreach', 'Crafting messages and reaching stakeholders.', 2, false, current_timestamp, current_timestamp),
('44444444-4444-4444-4444-444444444409', '33333333-3333-3333-3333-333333333306', 'Evaluation and Learning', 'Measuring impact and improving.', 3, true, current_timestamp, current_timestamp);

-- Public Speaking for Leaders (308): 2 modules
INSERT INTO module (id, course_id, title, description, module_order, has_quiz, created_at, updated_at) VALUES
('44444444-4444-4444-4444-44444444440a', '33333333-3333-3333-3333-333333333308', 'Overcoming Fear', 'Building confidence step by step.', 1, false, current_timestamp, current_timestamp),
('44444444-4444-4444-4444-44444444440b', '33333333-3333-3333-3333-333333333308', 'Structuring a Speech', 'Opening, body, and closing that work.', 2, true, current_timestamp, current_timestamp);

-- Monitoring and Evaluation Basics (310) – not published: 1 module
INSERT INTO module (id, course_id, title, description, module_order, has_quiz, created_at, updated_at) VALUES
('44444444-4444-4444-4444-44444444440c', '33333333-3333-3333-3333-333333333310', 'What is M&E?', 'Introduction to monitoring and evaluation concepts.', 1, false, current_timestamp, current_timestamp);

-- Networking and Partnerships (311): 2 modules
INSERT INTO module (id, course_id, title, description, module_order, has_quiz, created_at, updated_at) VALUES
('44444444-4444-4444-4444-44444444440d', '33333333-3333-3333-3333-333333333311', 'Why Partner?', 'Benefits of collaboration for community impact.', 1, false, current_timestamp, current_timestamp),
('44444444-4444-4444-4444-44444444440e', '33333333-3333-3333-3333-333333333311', 'Building Trust', 'Practical ways to build and maintain partnerships.', 2, true, current_timestamp, current_timestamp);

-- ---------------------------------------------------------------------------
-- Content blocks for modules above (TEXT only for brevity; some modules have none)
-- ---------------------------------------------------------------------------

INSERT INTO content_block (id, module_id, block_type, block_order, rich_text, created_at, updated_at) VALUES
('55555555-5555-5555-5555-555555555504', '44444444-4444-4444-4444-444444444404', 'TEXT', 1, '<p>Local government budgets affect services like health, education, and roads. This module explains how budgets are made and where you can find information.</p>', current_timestamp, current_timestamp),
('55555555-5555-5555-5555-555555555505', '44444444-4444-4444-4444-444444444405', 'TEXT', 1, '<p>Advocacy means making your voice heard so that decisions reflect community needs. Learn practical steps to engage with leaders and processes.</p>', current_timestamp, current_timestamp),
('55555555-5555-5555-5555-555555555506', '44444444-4444-4444-4444-444444444406', 'TEXT', 1, '<p>Young people have a right to participate in governance. This module covers formal and informal ways to get involved.</p>', current_timestamp, current_timestamp),
('55555555-5555-5555-5555-555555555507', '44444444-4444-4444-4444-444444444407', 'TEXT', 1, '<p>Good campaigns start with clear goals and a realistic strategy. We will look at planning tools you can use.</p>', current_timestamp, current_timestamp),
('55555555-5555-5555-5555-555555555508', '44444444-4444-4444-4444-44444444440a', 'TEXT', 1, '<p>Many people feel nervous about speaking in public. This module helps you understand that fear and build confidence through practice.</p>', current_timestamp, current_timestamp),
('55555555-5555-5555-5555-555555555509', '44444444-4444-4444-4444-44444444440c', 'TEXT', 1, '<p>Monitoring tracks what you do; evaluation asks whether it worked. Both help you learn and improve.</p>', current_timestamp, current_timestamp),
('55555555-5555-5555-5555-55555555550a', '44444444-4444-4444-4444-44444444440d', 'TEXT', 1, '<p>Partnerships can bring more resources, skills, and legitimacy to your work. This module explores why they matter.</p>', current_timestamp, current_timestamp);
