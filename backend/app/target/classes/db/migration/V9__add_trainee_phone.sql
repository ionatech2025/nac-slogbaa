-- Add phone number to trainee (country code + national number)
ALTER TABLE trainee
    ADD COLUMN IF NOT EXISTS phone_country_code VARCHAR(10),
    ADD COLUMN IF NOT EXISTS phone_national_number VARCHAR(20);

COMMENT ON COLUMN trainee.phone_country_code IS 'E.164 country code e.g. +256';
COMMENT ON COLUMN trainee.phone_national_number IS 'National number digits only, 4-15 chars';
