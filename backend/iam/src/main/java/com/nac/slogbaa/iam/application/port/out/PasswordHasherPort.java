package com.nac.slogbaa.iam.application.port.out;

/**
 * Port for password hashing and verification. Implementations (e.g. BCrypt) live in adapters.
 * No framework dependency in this interface.
 */
public interface PasswordHasherPort {

    /**
     * Hash a raw password for storage.
     */
    String hash(String rawPassword);

    /**
     * Verify a raw password against a stored hash.
     */
    boolean matches(String rawPassword, String hashedPassword);
}
