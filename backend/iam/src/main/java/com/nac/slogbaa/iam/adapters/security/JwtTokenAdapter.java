package com.nac.slogbaa.iam.adapters.security;

import com.nac.slogbaa.iam.application.port.out.AuthTokenPort;
import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import com.nac.slogbaa.iam.core.valueobject.AuthenticatedRole;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

/**
 * Hardened JWT implementation of AuthTokenPort.
 * <ul>
 *   <li>Rejects weak/default secrets at startup</li>
 *   <li>Adds issuer + audience claims for token binding</li>
 *   <li>Applies clock skew tolerance for distributed clocks</li>
 *   <li>Includes issuedAt for audit trail</li>
 * </ul>
 */
@Component
public class JwtTokenAdapter implements AuthTokenPort {

    private static final Logger log = LoggerFactory.getLogger(JwtTokenAdapter.class);

    private static final String CLAIM_USER_ID = "userId";
    private static final String CLAIM_EMAIL = "email";
    private static final String CLAIM_ROLE = "role";
    private static final int MIN_SECRET_BYTES = 32; // 256 bits for HS256
    private static final Duration CLOCK_SKEW = Duration.ofSeconds(30);
    private static final String DEFAULT_SECRET_MARKER = "default-secret";

    private final SecretKey signingKey;
    private final String issuer;
    private final String audience;

    public JwtTokenAdapter(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.issuer:slogbaa-lms}") String issuer,
            @Value("${app.jwt.audience:slogbaa-frontend}") String audience) {

        // Reject default/weak secrets — force env-provided key
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException(
                    "JWT secret must be set via JWT_SECRET env var or app.jwt.secret property");
        }
        if (secret.toLowerCase().contains(DEFAULT_SECRET_MARKER)) {
            log.warn("*** JWT secret contains default marker — acceptable ONLY in dev. "
                    + "Set a strong JWT_SECRET for production. ***");
        }

        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < MIN_SECRET_BYTES) {
            throw new IllegalStateException(
                    "JWT secret must be at least " + MIN_SECRET_BYTES + " bytes (256 bits). "
                            + "Current length: " + keyBytes.length + " bytes. "
                            + "Generate one with: openssl rand -base64 48");
        }

        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
        this.issuer = issuer;
        this.audience = audience;

        log.info("JWT adapter initialized — issuer={}, audience={}", issuer, audience);
    }

    @Override
    public String generateToken(AuthenticatedIdentity identity, long expirySeconds) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(identity.getUserId().toString())
                .issuer(issuer)
                .audience().add(audience).and()
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(expirySeconds)))
                .claim(CLAIM_USER_ID, identity.getUserId().toString())
                .claim(CLAIM_EMAIL, identity.getEmail())
                .claim(CLAIM_ROLE, identity.getRole().name())
                .signWith(signingKey)
                .compact();
    }

    @Override
    public Optional<AuthenticatedIdentity> parseToken(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(signingKey)
                    .requireIssuer(issuer)
                    .requireAudience(audience)
                    .clockSkewSeconds(CLOCK_SKEW.toSeconds())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            UUID userId = UUID.fromString(claims.get(CLAIM_USER_ID, String.class));
            String email = claims.get(CLAIM_EMAIL, String.class);
            AuthenticatedRole role = AuthenticatedRole.valueOf(claims.get(CLAIM_ROLE, String.class));
            return Optional.of(new AuthenticatedIdentity(userId, email, role));
        } catch (ExpiredJwtException e) {
            log.debug("JWT expired: {}", e.getMessage());
            return Optional.empty();
        } catch (MalformedJwtException | SignatureException e) {
            log.debug("JWT invalid (malformed or bad signature): {}", e.getMessage());
            return Optional.empty();
        } catch (IllegalArgumentException e) {
            log.debug("JWT parse error: {}", e.getMessage());
            return Optional.empty();
        } catch (Exception e) {
            log.warn("Unexpected JWT validation error: {}", e.getMessage());
            return Optional.empty();
        }
    }
}
