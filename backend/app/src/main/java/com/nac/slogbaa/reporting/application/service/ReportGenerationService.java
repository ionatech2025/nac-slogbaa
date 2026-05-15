package com.nac.slogbaa.reporting.application.service;

import com.nac.slogbaa.reporting.application.port.in.DownloadReportUseCase;
import com.nac.slogbaa.reporting.application.port.in.GetReportStatusUseCase;
import com.nac.slogbaa.reporting.application.port.in.RequestReportUseCase;
import com.nac.slogbaa.reporting.application.port.out.FileStoragePort;
import com.nac.slogbaa.reporting.application.port.out.ReportJobRepositoryPort;
import com.nac.slogbaa.reporting.domain.aggregate.ReportJob;
import com.nac.slogbaa.reporting.domain.valueobject.ReportStatus;
import com.nac.slogbaa.reporting.domain.valueobject.ReportType;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ReportGenerationService implements RequestReportUseCase, GetReportStatusUseCase, DownloadReportUseCase {

    private final ReportJobRepositoryPort reportJobRepositoryPort;
    private final FileStoragePort fileStoragePort;
    private final AsyncReportProcessor asyncReportProcessor;

    public ReportGenerationService(ReportJobRepositoryPort reportJobRepositoryPort,
                                   FileStoragePort fileStoragePort,
                                   AsyncReportProcessor asyncReportProcessor) {
        this.reportJobRepositoryPort = reportJobRepositoryPort;
        this.fileStoragePort = fileStoragePort;
        this.asyncReportProcessor = asyncReportProcessor;
    }

    @Override
    public UUID requestReport(ReportType type, String requestedByUserId) {
        // 1. Create a new pending job
        ReportJob job = new ReportJob(UUID.randomUUID(), type, requestedByUserId);
        
        // 2. Persist the job immediately to establish the state
        reportJobRepositoryPort.save(job);
        
        // 3. Hand off the heavy lifting to the asynchronous processor
        asyncReportProcessor.processReport(job.getJobId());
        
        // 4. Return the tracking ID to the client immediately
        return job.getJobId();
    }

    @Override
    public ReportJob getJobStatus(UUID jobId) {
        return reportJobRepositoryPort.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Report job not found: " + jobId));
    }

    @Override
    public byte[] downloadReport(UUID jobId) {
        ReportJob job = getJobStatus(jobId);
        
        if (job.getStatus() != ReportStatus.COMPLETED) {
            throw new IllegalStateException("Report is not ready for download. Current status: " + job.getStatus());
        }
        
        return fileStoragePort.getFile(job.getFileUrl());
    }
}
