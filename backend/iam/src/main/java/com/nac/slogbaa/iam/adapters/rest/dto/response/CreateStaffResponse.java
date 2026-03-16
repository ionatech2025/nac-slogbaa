package com.nac.slogbaa.iam.adapters.rest.dto.response;

/**
 * Response after creating a staff user.
 */
public record CreateStaffResponse(String id, String email, String fullName, String role) {}
