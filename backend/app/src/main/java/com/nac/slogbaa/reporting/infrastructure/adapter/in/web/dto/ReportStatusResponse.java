package com.nac.slogbaa.reporting.infrastructure.adapter.in.web.dto;

import com.nac.slogbaa.reporting.domain.aggregate.ReportJob;
import com.nac.slogbaa.reporting.domain.valueobject.ReportStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record ReportStatusResponse(
    UUID jobId,
    ReportStatus status,
    String errorMessage,
    LocalDateTime requestedAt,
    LocalDateTime completedAt,
    boolean isReady
) {
    public static ReportStatusResponse from(ReportJob job) {
        return new ReportStatusResponse(
            job.getJobId(),
            job.getStatus(),
            job.getErrorMessage(),
            job.getRequestedAt(),
            job.getCompletedAt(),
            job.getStatus() == ReportStatus.COMPLETED
        );
    }
}
