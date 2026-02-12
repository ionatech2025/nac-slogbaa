package com.nac.slogbaa.iam.adapters.rest.dto.response;

/**
 * REST response for successful login (JWT + user info).
 */
public class AuthResponse {

    private final String token;
    private final String userId;
    private final String email;
    private final String role;
    private final String fullName;

    public AuthResponse(String token, String userId, String email, String role, String fullName) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.role = role;
        this.fullName = fullName;
    }

    public String getToken() { return token; }
    public String getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getFullName() { return fullName; }
}
