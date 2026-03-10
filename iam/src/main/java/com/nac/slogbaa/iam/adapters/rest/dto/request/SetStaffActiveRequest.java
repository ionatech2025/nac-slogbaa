package com.nac.slogbaa.iam.adapters.rest.dto.request;

/**
 * Request body for PATCH /api/admin/staff/:id/active.
 */
public record SetStaffActiveRequest(boolean active) {}
