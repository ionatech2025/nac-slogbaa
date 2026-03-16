package com.nac.slogbaa.iam.unit.adapters;

import com.nac.slogbaa.iam.adapters.security.JwtTokenAdapter;
import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import com.nac.slogbaa.iam.core.valueobject.AuthenticatedRole;
import org.junit.jupiter.api.Test;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenAdapterTest {

    // 48 bytes = 384 bits, well above 256-bit minimum
    private static final String STRONG_SECRET = "this-is-a-strong-secret-key-for-testing-purposes-at-least-256-bits-long";

    private final JwtTokenAdapter adapter = new JwtTokenAdapter(STRONG_SECRET, "test-issuer", "test-audience");

    @Test
    void generateAndParseTokenSucceeds() {
        UUID userId = UUID.randomUUID();
        AuthenticatedIdentity identity = new AuthenticatedIdentity(userId, "user@example.com", AuthenticatedRole.TRAINEE);

        String token = adapter.generateToken(identity, 3600);
        assertNotNull(token);
        assertFalse(token.isBlank());

        Optional<AuthenticatedIdentity> parsed = adapter.parseToken(token);
        assertTrue(parsed.isPresent());
        assertEquals(userId, parsed.get().getUserId());
        assertEquals("user@example.com", parsed.get().getEmail());
        assertEquals(AuthenticatedRole.TRAINEE, parsed.get().getRole());
    }

    @Test
    void expiredTokenReturnsEmpty() {
        UUID userId = UUID.randomUUID();
        AuthenticatedIdentity identity = new AuthenticatedIdentity(userId, "user@example.com", AuthenticatedRole.ADMIN);

        // Token expired 60 seconds ago — exceeds 30s clock skew tolerance
        String token = adapter.generateToken(identity, -60);
        Optional<AuthenticatedIdentity> parsed = adapter.parseToken(token);
        assertTrue(parsed.isEmpty());
    }

    @Test
    void malformedTokenReturnsEmpty() {
        Optional<AuthenticatedIdentity> parsed = adapter.parseToken("not.a.jwt");
        assertTrue(parsed.isEmpty());
    }

    @Test
    void nullTokenReturnsEmpty() {
        assertTrue(adapter.parseToken(null).isEmpty());
    }

    @Test
    void blankTokenReturnsEmpty() {
        assertTrue(adapter.parseToken("   ").isEmpty());
    }

    @Test
    void tokenWithWrongSecretReturnsEmpty() {
        JwtTokenAdapter otherAdapter = new JwtTokenAdapter(
                "another-secret-key-that-is-at-least-256-bits-long-for-testing", "test-issuer", "test-audience");

        UUID userId = UUID.randomUUID();
        AuthenticatedIdentity identity = new AuthenticatedIdentity(userId, "user@example.com", AuthenticatedRole.TRAINEE);
        String token = otherAdapter.generateToken(identity, 3600);

        // Parsing with different key should fail
        assertTrue(adapter.parseToken(token).isEmpty());
    }

    @Test
    void tokenWithWrongIssuerIsRejected() {
        JwtTokenAdapter wrongIssuer = new JwtTokenAdapter(STRONG_SECRET, "wrong-issuer", "test-audience");
        UUID userId = UUID.randomUUID();
        AuthenticatedIdentity identity = new AuthenticatedIdentity(userId, "user@example.com", AuthenticatedRole.TRAINEE);
        String token = wrongIssuer.generateToken(identity, 3600);

        assertTrue(adapter.parseToken(token).isEmpty());
    }

    @Test
    void tokenWithWrongAudienceIsRejected() {
        JwtTokenAdapter wrongAudience = new JwtTokenAdapter(STRONG_SECRET, "test-issuer", "wrong-audience");
        UUID userId = UUID.randomUUID();
        AuthenticatedIdentity identity = new AuthenticatedIdentity(userId, "user@example.com", AuthenticatedRole.TRAINEE);
        String token = wrongAudience.generateToken(identity, 3600);

        assertTrue(adapter.parseToken(token).isEmpty());
    }

    @Test
    void rejectsWeakSecret() {
        assertThrows(IllegalStateException.class, () ->
                new JwtTokenAdapter("short", "issuer", "audience"));
    }

    @Test
    void rejectsNullSecret() {
        assertThrows(IllegalStateException.class, () ->
                new JwtTokenAdapter(null, "issuer", "audience"));
    }

    @Test
    void allRolesAreSupported() {
        for (AuthenticatedRole role : AuthenticatedRole.values()) {
            UUID userId = UUID.randomUUID();
            AuthenticatedIdentity identity = new AuthenticatedIdentity(userId, "test@example.com", role);
            String token = adapter.generateToken(identity, 3600);
            Optional<AuthenticatedIdentity> parsed = adapter.parseToken(token);
            assertTrue(parsed.isPresent(), "Failed for role: " + role);
            assertEquals(role, parsed.get().getRole());
        }
    }
}
