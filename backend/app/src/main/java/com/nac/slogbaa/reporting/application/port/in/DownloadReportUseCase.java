package com.nac.slogbaa.reporting.application.port.in;

import java.util.UUID;

public interface DownloadReportUseCase {
    byte[] downloadReport(UUID jobId);
}
