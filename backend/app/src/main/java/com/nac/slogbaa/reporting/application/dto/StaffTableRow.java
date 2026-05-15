package com.nac.slogbaa.reporting.application.dto;

public record StaffTableRow(
    String name,
    String email,
    String role,
    String status,
    String lastLogin
) {}
