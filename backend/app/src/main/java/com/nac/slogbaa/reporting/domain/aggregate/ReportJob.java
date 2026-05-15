package com.nac.slogbaa.reporting.domain.aggregate;

import com.nac.slogbaa.reporting.domain.valueobject.ReportStatus;
import com.nac.slogbaa.reporting.domain.valueobject.ReportType;

import java.time.LocalDateTime;
import java.util.UUID;

public class ReportJob {
    private final UUID jobId;
    private final ReportType reportType;
    private final String requestedBy;
    private final LocalDateTime requestedAt;
    
    private ReportStatus status;
    private String fileUrl;
    private String errorMessage;
    private LocalDateTime completedAt;

    public ReportJob(UUID jobId, ReportType reportType, String requestedBy) {
        this.jobId = jobId;
        this.reportType = reportType;
        this.requestedBy = requestedBy;
        this.requestedAt = LocalDateTime.now();
        this.status = ReportStatus.PENDING;
    }

    public void markAsProcessing() {
        this.status = ReportStatus.PROCESSING;
    }

    public void markAsCompleted(String fileUrl) {
        this.status = ReportStatus.COMPLETED;
        this.fileUrl = fileUrl;
        this.completedAt = LocalDateTime.now();
    }

    public void markAsFailed(String errorMessage) {
        this.status = ReportStatus.FAILED;
        this.errorMessage = errorMessage;
        this.completedAt = LocalDateTime.now();
    }

    // Getters
    public UUID getJobId() { return jobId; }
    public ReportType getReportType() { return reportType; }
    public String getRequestedBy() { return requestedBy; }
    public LocalDateTime getRequestedAt() { return requestedAt; }
    public ReportStatus getStatus() { return status; }
    public String getFileUrl() { return fileUrl; }
    public String getErrorMessage() { return errorMessage; }
    public LocalDateTime getCompletedAt() { return completedAt; }
}
