package com.nac.slogbaa.reporting.application.port.in;

import com.nac.slogbaa.reporting.domain.aggregate.ReportJob;

import java.util.UUID;

public interface GetReportStatusUseCase {
    ReportJob getJobStatus(UUID jobId);
}
