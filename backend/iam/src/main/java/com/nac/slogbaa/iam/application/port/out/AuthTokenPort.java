package com.nac.slogbaa.iam.application.port.out;

import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;

import java.util.Optional;

/**
 * Port for issuing and validating auth tokens (e.g. JWT). Implementations in adapters.
 * Core type {@link AuthenticatedIdentity} is used; no JWT or framework type in API.
 */
public interface AuthTokenPort {

    /**
     * Generate a token for the given identity, valid for the given duration in seconds.
     */
    String generateToken(AuthenticatedIdentity identity, long expirySeconds);

    /**
     * Parse and validate a token; returns empty if invalid or expired.
     */
    Optional<AuthenticatedIdentity> parseToken(String token);
}
