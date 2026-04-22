-- ---------------------------------------------------------------------------
-- Public Library Resources
-- ---------------------------------------------------------------------------

CREATE TABLE public_library_resource (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(500) NOT NULL,
    description     TEXT,
    category        VARCHAR(50) NOT NULL CHECK (category IN ('GENERAL', 'MANUAL', 'REPORT', 'POLICY')),
    file_url        VARCHAR(2048) NOT NULL,
    image_url       VARCHAR(2048),
    sort_order      INT NOT NULL DEFAULT 0,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE INDEX idx_pub_lib_res_active ON public_library_resource (is_active) WHERE is_active = true;
CREATE INDEX idx_pub_lib_res_category ON public_library_resource (category);
