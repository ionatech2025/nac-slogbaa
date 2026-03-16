package com.nac.slogbaa.iam.core.valueobject;

import java.util.Objects;
import java.util.regex.Pattern;

/**
 * Phone number: E.164-style country code (e.g. +256) and national number (digits only).
 * Optional; when provided both parts must be valid.
 */
public final class PhoneNumber {
    private static final Pattern COUNTRY_CODE = Pattern.compile("\\+[0-9]{1,4}");
    private static final Pattern NATIONAL_NUMBER = Pattern.compile("[0-9]{4,15}");

    private final String countryCode;
    private final String nationalNumber;

    /**
     * @param countryCode e.g. "+256" (optional; null or blank allowed)
     * @param nationalNumber digits only, 4–15 length (optional; null or blank allowed)
     * @throws IllegalArgumentException if either is non-blank but invalid
     */
    public PhoneNumber(String countryCode, String nationalNumber) {
        String cc = countryCode != null ? countryCode.trim() : null;
        String nn = nationalNumber != null ? nationalNumber.trim().replaceAll("\\s", "") : null;
        if (cc != null && !cc.isEmpty()) {
            if (!COUNTRY_CODE.matcher(cc).matches()) {
                throw new IllegalArgumentException("Invalid phone country code: must be like +256 (plus and 1–4 digits)");
            }
            this.countryCode = cc;
        } else {
            this.countryCode = null;
        }
        if (nn != null && !nn.isEmpty()) {
            if (!NATIONAL_NUMBER.matcher(nn).matches()) {
                throw new IllegalArgumentException("Invalid phone number: must be 4–15 digits");
            }
            this.nationalNumber = nn;
        } else {
            this.nationalNumber = null;
        }
        if (this.countryCode != null && this.nationalNumber == null
                || this.countryCode == null && this.nationalNumber != null) {
            throw new IllegalArgumentException("Phone number must provide both country code and national number, or neither");
        }
    }

    public String getCountryCode() {
        return countryCode;
    }

    public String getNationalNumber() {
        return nationalNumber;
    }

    public boolean isPresent() {
        return countryCode != null && nationalNumber != null;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PhoneNumber that = (PhoneNumber) o;
        return Objects.equals(countryCode, that.countryCode) && Objects.equals(nationalNumber, that.nationalNumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(countryCode, nationalNumber);
    }
}
