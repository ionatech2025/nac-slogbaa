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
import java.util.Optional;
import java.util.UUID;

/**
 * JWT implementation of AuthTokenPort. Keeps JWT library usage in adapter only.
 */
@Component
public class JwtTokenAdapter implements AuthTokenPort {

    private static final Logger log = LoggerFactory.getLogger(JwtTokenAdapter.class);

    private final SecretKey signingKey;
    private static final String CLAIM_USER_ID = "userId";
    private static final String CLAIM_EMAIL = "email";
    private static final String CLAIM_ROLE = "role";

    public JwtTokenAdapter(@Value("${app.jwt.secret:default-secret-change-in-production-min-256-bits}") String secret) {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            byte[] padded = new byte[32];
            System.arraycopy(keyBytes, 0, padded, 0, keyBytes.length);
            keyBytes = padded;
        }
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
    }

    @Override
    public String generateToken(AuthenticatedIdentity identity, long expirySeconds) {
        return Jwts.builder()
                .subject(identity.getUserId().toString())
                .claim(CLAIM_USER_ID, identity.getUserId().toString())
                .claim(CLAIM_EMAIL, identity.getEmail())
                .claim(CLAIM_ROLE, identity.getRole().name())
                .signWith(signingKey)
                .expiration(java.util.Date.from(java.time.Instant.now().plusSeconds(expirySeconds)))
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
        }
    }
}
