-- ---------------------------------------------------------------------------
-- Identity & Access Management (IAM) Context
-- Trainee and StaffUser aggregates
-- ---------------------------------------------------------------------------

CREATE TABLE staff_user (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name       VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    staff_role      VARCHAR(50) NOT NULL CHECK (staff_role IN ('SUPER_ADMIN', 'ADMIN')),
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    last_login_at   TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_staff_user_email UNIQUE (email)
);

CREATE INDEX idx_staff_user_email ON staff_user (email);
CREATE INDEX idx_staff_user_active ON staff_user (is_active) WHERE is_active = true;

-- ---------------------------------------------------------------------------

CREATE TABLE trainee (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name          VARCHAR(100) NOT NULL,
    last_name           VARCHAR(100) NOT NULL,
    email               VARCHAR(255) NOT NULL,
    password_hash       VARCHAR(255) NOT NULL,
    street              VARCHAR(255),
    city                VARCHAR(100),
    postal_code         VARCHAR(20),
    gender              VARCHAR(20) NOT NULL CHECK (gender IN ('MALE', 'FEMALE')),
    district_name       VARCHAR(100) NOT NULL,
    region              VARCHAR(100),
    trainee_category    VARCHAR(50) NOT NULL CHECK (trainee_category IN ('LEADER', 'CIVIL_SOCIETY_MEMBER', 'COMMUNITY_MEMBER')),
    is_active           BOOLEAN NOT NULL DEFAULT true,
    registration_date   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    last_login_at       TIMESTAMP WITH TIME ZONE,
    email_verified      BOOLEAN NOT NULL DEFAULT false,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    CONSTRAINT uq_trainee_email UNIQUE (email)
);

CREATE INDEX idx_trainee_email ON trainee (email);
CREATE INDEX idx_trainee_active ON trainee (is_active) WHERE is_active = true;
CREATE INDEX idx_trainee_category ON trainee (trainee_category);
CREATE INDEX idx_trainee_district ON trainee (district_name);
CREATE INDEX idx_trainee_registration ON trainee (registration_date);
