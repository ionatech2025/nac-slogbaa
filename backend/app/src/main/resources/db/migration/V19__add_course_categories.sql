CREATE TABLE course_category (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    CONSTRAINT uq_course_category_slug UNIQUE (slug)
);
ALTER TABLE course ADD COLUMN category_id UUID REFERENCES course_category(id);
CREATE INDEX idx_course_category ON course(category_id);

INSERT INTO course_category (name, slug) VALUES
    ('Leadership', 'leadership'),
    ('Governance', 'governance'),
    ('Community Development', 'community-development'),
    ('Civil Society', 'civil-society'),
    ('General', 'general');
