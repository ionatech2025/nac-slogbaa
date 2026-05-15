package com.nac.slogbaa.reporting.application.dto;

public record InteractionTableRow(
    String courseName,
    String threadTitle,
    String authorName,
    String authorType,
    int replyCount,
    String createdDate
) {}
