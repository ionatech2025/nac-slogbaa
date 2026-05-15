package com.nac.slogbaa.reporting.application.service;

import com.nac.slogbaa.reporting.application.port.out.FileStoragePort;
import com.nac.slogbaa.reporting.application.port.out.PdfGeneratorPort;
import com.nac.slogbaa.reporting.application.port.out.ReportDataQueryPort;
import com.nac.slogbaa.reporting.application.port.out.ReportJobRepositoryPort;
import com.nac.slogbaa.reporting.domain.aggregate.ReportJob;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class AsyncReportProcessor {

    private static final Logger log = LoggerFactory.getLogger(AsyncReportProcessor.class);

    private final ReportJobRepositoryPort reportJobRepositoryPort;
    private final ReportDataQueryPort reportDataQueryPort;
    private final PdfGeneratorPort pdfGeneratorPort;
    private final FileStoragePort fileStoragePort;

    public AsyncReportProcessor(ReportJobRepositoryPort reportJobRepositoryPort,
                                ReportDataQueryPort reportDataQueryPort,
                                PdfGeneratorPort pdfGeneratorPort,
                                FileStoragePort fileStoragePort) {
        this.reportJobRepositoryPort = reportJobRepositoryPort;
        this.reportDataQueryPort = reportDataQueryPort;
        this.pdfGeneratorPort = pdfGeneratorPort;
        this.fileStoragePort = fileStoragePort;
    }

    @Async
    public void processReport(UUID jobId) {
        log.info("Starting asynchronous processing for Report Job: {}", jobId);
        
        ReportJob job = reportJobRepositoryPort.findById(jobId).orElse(null);
        if (job == null) {
            log.error("Could not find Report Job: {}", jobId);
            return;
        }

        try {
            // 1. Mark as Processing
            job.markAsProcessing();
            reportJobRepositoryPort.save(job);

            // 2. Fetch Aggregated Data (using the Database Port)
            log.debug("Fetching data for report type: {}", job.getReportType());
            Object reportData = switch (job.getReportType()) {
                case EXECUTIVE_OVERVIEW -> reportDataQueryPort.fetchExecutiveOverviewData();
                case COURSE_ANALYTICS -> reportDataQueryPort.fetchCourseAnalyticsData();
                case TRAINEE_PROGRESS -> reportDataQueryPort.fetchTraineeProgressData();
            };

            // 3. Generate PDF (using the PDF Port)
            log.debug("Generating PDF for job: {}", jobId);
            byte[] pdfBytes = pdfGeneratorPort.generatePdf(reportData);

            // 4. Save to Local Disk (using the Storage Port)
            String filename = "report_" + job.getReportType().name().toLowerCase() + "_" + jobId + ".pdf";
            String fileUrl = fileStoragePort.saveFile(jobId, pdfBytes, filename);

            // 5. Mark as Completed
            job.markAsCompleted(fileUrl);
            reportJobRepositoryPort.save(job);
            log.info("Successfully completed Report Job: {}", jobId);
            
        } catch (Exception e) {
            log.error("Failed to process Report Job: {}", jobId, e);
            job.markAsFailed(e.getMessage() != null ? e.getMessage() : "Unknown error occurred during generation");
            reportJobRepositoryPort.save(job);
        }
    }
}
