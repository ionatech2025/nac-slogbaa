package com.nac.slogbaa.iam.unit.core;

import com.nac.slogbaa.iam.core.valueobject.Email;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

class EmailTest {

    @Test
    void validEmailIsAccepted() {
        Email email = new Email("user@example.com");
        assertEquals("user@example.com", email.getValue());
    }

    @Test
    void emailIsNormalizedToLowercase() {
        Email email = new Email("User@Example.COM");
        assertEquals("user@example.com", email.getValue());
    }

    @Test
    void emailIsTrimmed() {
        Email email = new Email("  user@example.com  ");
        assertEquals("user@example.com", email.getValue());
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {"  ", "not-an-email", "@example.com", "user@", "user@.com", "user@com"})
    void invalidEmailsAreRejected(String input) {
        assertThrows(IllegalArgumentException.class, () -> new Email(input));
    }

    @Test
    void equalsAndHashCodeWorkCorrectly() {
        Email a = new Email("user@example.com");
        Email b = new Email("User@Example.COM");
        assertEquals(a, b);
        assertEquals(a.hashCode(), b.hashCode());
    }

    @Test
    void differentEmailsAreNotEqual() {
        Email a = new Email("user1@example.com");
        Email b = new Email("user2@example.com");
        assertNotEquals(a, b);
    }

    @Test
    void toStringReturnsValue() {
        Email email = new Email("user@example.com");
        assertEquals("user@example.com", email.toString());
    }
}
