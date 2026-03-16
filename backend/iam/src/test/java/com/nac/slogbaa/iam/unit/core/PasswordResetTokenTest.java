package com.nac.slogbaa.iam.unit.core;

import com.nac.slogbaa.iam.core.entity.PasswordResetToken;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

class PasswordResetTokenTest {

    @Test
    void futureExpiryIsNotExpired() {
        PasswordResetToken token = new PasswordResetToken("tok", "user@test.com", Instant.now().plusSeconds(300));
        assertFalse(token.isExpired());
    }

    @Test
    void pastExpiryIsExpired() {
        PasswordResetToken token = new PasswordResetToken("tok", "user@test.com", Instant.now().minusSeconds(60));
        assertTrue(token.isExpired());
    }

    @Test
    void nullTokenRejected() {
        assertThrows(NullPointerException.class, () -> new PasswordResetToken(null, "a@b.com", Instant.now()));
    }

    @Test
    void nullEmailRejected() {
        assertThrows(NullPointerException.class, () -> new PasswordResetToken("tok", null, Instant.now()));
    }

    @Test
    void nullExpiryRejected() {
        assertThrows(NullPointerException.class, () -> new PasswordResetToken("tok", "a@b.com", null));
    }

    @Test
    void gettersReturnConstructorValues() {
        Instant expiry = Instant.now().plusSeconds(600);
        PasswordResetToken token = new PasswordResetToken("my-token", "user@test.com", expiry);
        assertEquals("my-token", token.getToken());
        assertEquals("user@test.com", token.getUserEmail());
        assertEquals(expiry, token.getExpiryDate());
    }
}
