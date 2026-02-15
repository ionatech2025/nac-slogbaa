package com.nac.slogbaa.iam.adapters.rest.dto.response;

/**
 * REST response: staff summary for dashboard list.
 */
public record StaffSummaryResponse(String id, String fullName, String email, String role) {}
