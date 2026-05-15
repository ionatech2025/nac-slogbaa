package com.nac.slogbaa.reporting.application.dto;

public record WithdrawalLogTableRow(
    String dateOfWithdrawal,
    String traineeName,
    String courseName,
    String withdrawalReason
) {}
