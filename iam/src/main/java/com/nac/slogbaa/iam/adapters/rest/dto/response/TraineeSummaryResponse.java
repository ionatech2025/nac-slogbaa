package com.nac.slogbaa.iam.adapters.rest.dto.response;

/**
 * REST response: trainee summary for dashboard list.
 */
public record TraineeSummaryResponse(String id, String fullName, String email, String districtName) {}
