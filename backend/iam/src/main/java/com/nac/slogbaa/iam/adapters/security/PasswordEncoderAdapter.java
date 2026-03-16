package com.nac.slogbaa.iam.adapters.security;

import com.nac.slogbaa.iam.application.port.out.PasswordHasherPort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * BCrypt password hashing adapter. Strength 13 balances security (~400ms hash time)
 * with acceptable login latency. Increase to 14 only after benchmarking.
 */
@Component
public class PasswordEncoderAdapter implements PasswordHasherPort {

    private static final int BCRYPT_STRENGTH = 13;
    private final PasswordEncoder delegate = new BCryptPasswordEncoder(BCRYPT_STRENGTH);

    @Override
    public String hash(String rawPassword) {
        return delegate.encode(rawPassword);
    }

    @Override
    public boolean matches(String rawPassword, String hashedPassword) {
        return delegate.matches(rawPassword, hashedPassword);
    }
}
