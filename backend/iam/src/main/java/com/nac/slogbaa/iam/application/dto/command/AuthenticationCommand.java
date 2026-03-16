package com.nac.slogbaa.iam.application.dto.command;

import java.util.Objects;

/**
 * Command for login. No framework dependency.
 */
public final class AuthenticationCommand {
    private final String email;
    private final String password;

    public AuthenticationCommand(String email, String password) {
        this.email = Objects.requireNonNull(email, "email must not be null");
        this.password = Objects.requireNonNull(password, "password must not be null");
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
}
