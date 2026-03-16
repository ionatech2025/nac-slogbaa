package com.nac.slogbaa.iam.unit.core;

import com.nac.slogbaa.iam.core.valueobject.PhoneNumber;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PhoneNumberTest {

    @Test
    void validPhoneAccepted() {
        PhoneNumber phone = new PhoneNumber("+256", "712345678");
        assertEquals("+256", phone.getCountryCode());
        assertEquals("712345678", phone.getNationalNumber());
        assertTrue(phone.isPresent());
    }

    @Test
    void bothNullIsAllowed() {
        PhoneNumber phone = new PhoneNumber(null, null);
        assertFalse(phone.isPresent());
    }

    @Test
    void bothBlankIsAllowed() {
        PhoneNumber phone = new PhoneNumber("", "");
        assertFalse(phone.isPresent());
    }

    @Test
    void spacesInNationalNumberRemoved() {
        PhoneNumber phone = new PhoneNumber("+1", "555 123 4567");
        assertEquals("5551234567", phone.getNationalNumber());
    }

    @Test
    void invalidCountryCodeRejected() {
        assertThrows(IllegalArgumentException.class, () -> new PhoneNumber("256", "712345678"));
    }

    @Test
    void tooShortNationalNumberRejected() {
        assertThrows(IllegalArgumentException.class, () -> new PhoneNumber("+1", "123"));
    }

    @Test
    void countryCodeWithoutNumberRejected() {
        assertThrows(IllegalArgumentException.class, () -> new PhoneNumber("+256", null));
    }

    @Test
    void numberWithoutCountryCodeRejected() {
        assertThrows(IllegalArgumentException.class, () -> new PhoneNumber(null, "712345678"));
    }

    @Test
    void equalsAndHashCode() {
        PhoneNumber a = new PhoneNumber("+256", "712345678");
        PhoneNumber b = new PhoneNumber("+256", "712345678");
        assertEquals(a, b);
        assertEquals(a.hashCode(), b.hashCode());
    }
}
