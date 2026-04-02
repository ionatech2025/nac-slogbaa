package com.nac.slogbaa.progress.adapters.rest.controller;

import com.nac.slogbaa.progress.application.dto.CertificateSummaryResult;
import com.nac.slogbaa.progress.application.port.in.ListCertificatesUseCase;
import com.nac.slogbaa.progress.application.port.in.RevokeCertificateUseCase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for admin certificate management.
 * List: ADMIN and SUPER_ADMIN. Revoke: SUPER_ADMIN only.
 */
@RestController
@RequestMapping("/api/admin/certificates")
public class AdminCertificateController {

    private final ListCertificatesUseCase listCertificatesUseCase;
    private final RevokeCertificateUseCase revokeCertificateUseCase;
    private final com.nac.slogbaa.progress.application.port.in.UploadManualCertificateUseCase uploadManualCertificateUseCase;

    public AdminCertificateController(ListCertificatesUseCase listCertificatesUseCase,
                                      RevokeCertificateUseCase revokeCertificateUseCase,
                                      com.nac.slogbaa.progress.application.port.in.UploadManualCertificateUseCase uploadManualCertificateUseCase) {
        this.listCertificatesUseCase = listCertificatesUseCase;
        this.revokeCertificateUseCase = revokeCertificateUseCase;
        this.uploadManualCertificateUseCase = uploadManualCertificateUseCase;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<Page<CertificateResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 100), Sort.by("issuedDate").descending());
        Page<CertificateSummaryResult> results = listCertificatesUseCase.list(pageable);
        Page<CertificateResponse> body = results.map(r -> new CertificateResponse(
                r.id().toString(),
                r.traineeId().toString(),
                r.courseId().toString(),
                r.certificateNumber(),
                r.issuedDate().toString(),
                r.finalScorePercent(),
                r.revoked(),
                r.traineeName(),
                r.courseTitle()
        ));
        return ResponseEntity.ok(body);
    }

    @PostMapping("/{id}/revoke")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> revoke(@PathVariable UUID id) {
        try {
            revokeCertificateUseCase.revoke(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/upload")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> upload(
            @RequestParam("traineeId") UUID traineeId,
            @RequestParam("courseId") UUID courseId,
            @RequestParam("certificateNumber") String certificateNumber,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        try {
            if (file.isEmpty() || !org.springframework.util.StringUtils.getFilenameExtension(file.getOriginalFilename()).equalsIgnoreCase("pdf")) {
                return ResponseEntity.badRequest().build();
            }
            uploadManualCertificateUseCase.upload(
                    traineeId,
                    courseId,
                    certificateNumber,
                    file.getBytes(),
                    file.getOriginalFilename()
            );
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    public record CertificateResponse(
            String id,
            String traineeId,
            String courseId,
            String certificateNumber,
            String issuedDate,
            int finalScorePercent,
            boolean revoked,
            String traineeName,
            String courseTitle
    ) {}
}
