package com.nac.slogbaa.iam.adapters.security;

import com.nac.slogbaa.iam.application.port.out.PasswordHasherPort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PasswordEncoderAdapter implements PasswordHasherPort {

    private final PasswordEncoder delegate = new BCryptPasswordEncoder(10);

    @Override
    public String hash(String rawPassword) {
        return delegate.encode(rawPassword);
    }

    @Override
    public boolean matches(String rawPassword, String hashedPassword) {
        return delegate.matches(rawPassword, hashedPassword);
    }
}
