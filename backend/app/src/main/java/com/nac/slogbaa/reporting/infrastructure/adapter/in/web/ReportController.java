package com.nac.slogbaa.reporting.infrastructure.adapter.in.web;

import com.nac.slogbaa.reporting.application.port.in.DownloadReportUseCase;
import com.nac.slogbaa.reporting.application.port.in.GetReportStatusUseCase;
import com.nac.slogbaa.reporting.application.port.in.RequestReportUseCase;
import com.nac.slogbaa.reporting.domain.aggregate.ReportJob;
import com.nac.slogbaa.reporting.infrastructure.adapter.in.web.dto.ReportRequest;
import com.nac.slogbaa.reporting.infrastructure.adapter.in.web.dto.ReportStatusResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/reports")
public class ReportController {

    private final RequestReportUseCase requestReportUseCase;
    private final GetReportStatusUseCase getReportStatusUseCase;
    private final DownloadReportUseCase downloadReportUseCase;

    public ReportController(RequestReportUseCase requestReportUseCase,
                            GetReportStatusUseCase getReportStatusUseCase,
                            DownloadReportUseCase downloadReportUseCase) {
        this.requestReportUseCase = requestReportUseCase;
        this.getReportStatusUseCase = getReportStatusUseCase;
        this.downloadReportUseCase = downloadReportUseCase;
    }

    @PostMapping("/generate")
    public ResponseEntity<Map<String, UUID>> generateReport(@RequestBody ReportRequest request, Principal principal) {
        String username = principal != null ? principal.getName() : "system";
        UUID jobId = requestReportUseCase.requestReport(request.reportType(), username);
        return ResponseEntity.accepted().body(Map.of("jobId", jobId));
    }

    @GetMapping("/jobs/{jobId}")
    public ResponseEntity<ReportStatusResponse> getJobStatus(@PathVariable UUID jobId) {
        ReportJob job = getReportStatusUseCase.getJobStatus(jobId);
        return ResponseEntity.ok(ReportStatusResponse.from(job));
    }

    @GetMapping("/jobs/{jobId}/download")
    public ResponseEntity<byte[]> downloadReport(@PathVariable UUID jobId) {
        ReportJob job = getReportStatusUseCase.getJobStatus(jobId);
        byte[] pdfBytes = downloadReportUseCase.downloadReport(jobId);
        
        String filename = "report_" + job.getReportType().name().toLowerCase() + "_" + jobId + ".pdf";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
