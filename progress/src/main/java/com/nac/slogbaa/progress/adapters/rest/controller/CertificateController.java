package com.nac.slogbaa.progress.adapters.rest.controller;

import com.nac.slogbaa.iam.application.dto.result.TraineeDetails;
import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import com.nac.slogbaa.progress.adapters.persistence.entity.CertificateEntity;
import com.nac.slogbaa.progress.adapters.persistence.repository.JpaCertificateRepository;
import com.nac.slogbaa.shared.ports.TraineeNotificationPort;
import com.nac.slogbaa.iam.application.port.in.GetTraineeByIdUseCase;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

/**
 * REST controller for trainee certificate access (list, download).
 */
@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    private final JpaCertificateRepository certificateRepository;
    private final String uploadDir;
    private final GetTraineeByIdUseCase getTraineeByIdUseCase;
    private final TraineeNotificationPort traineeNotificationPort;

    public CertificateController(JpaCertificateRepository certificateRepository,
                                @Value("${app.file.upload-dir:uploads}") String uploadDir,
                                GetTraineeByIdUseCase getTraineeByIdUseCase,
                                TraineeNotificationPort traineeNotificationPort) {
        this.certificateRepository = certificateRepository;
        this.uploadDir = uploadDir;
        this.getTraineeByIdUseCase = getTraineeByIdUseCase;
        this.traineeNotificationPort = traineeNotificationPort;
    }

    @GetMapping
    @PreAuthorize("hasRole('TRAINEE')")
    public ResponseEntity<List<TraineeCertificateResponse>> list(
            @AuthenticationPrincipal AuthenticatedIdentity identity) {
        var certs = certificateRepository.findTraineeCertificatesWithCourse(identity.getUserId());
        List<TraineeCertificateResponse> body = certs.stream()
                .map(c -> new TraineeCertificateResponse(
                        c.getId().toString(),
                        c.getCourseId().toString(),
                        c.getCourseTitle(),
                        c.getCertificateNumber(),
                        c.getIssuedDate().toString(),
                        c.getFinalScorePercent(),
                        c.getFileUrl()
                ))
                .toList();
        return ResponseEntity.ok(body);
    }

    @GetMapping("/{id}/download")
    @PreAuthorize("hasRole('TRAINEE')")
    public ResponseEntity<Resource> download(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @PathVariable UUID id) {
        var certOpt = certificateRepository.findById(id)
                .filter(c -> c.getTraineeId().equals(identity.getUserId()) && !c.isRevoked());
        if (certOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        var c = certOpt.get();
        if (c.getFileUrl() == null || c.getFileUrl().isBlank()) {
            return ResponseEntity.notFound().build();
        }
        try {
            String relativePath = c.getFileUrl().replaceFirst("^/uploads/", "");
            Path path = Path.of(uploadDir).resolve(relativePath).normalize();
            if (!Files.exists(path) || !Files.isReadable(path)) {
                return ResponseEntity.notFound().build();
            }
            byte[] bytes = Files.readAllBytes(path);
            String filename = c.getCertificateNumber() + ".pdf";
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(new ByteArrayResource(bytes));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/send-email")
    @PreAuthorize("hasRole('TRAINEE')")
    public ResponseEntity<Void> sendEmail(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @PathVariable UUID id) {
        var certOpt = certificateRepository.findById(id)
                .filter(c -> c.getTraineeId().equals(identity.getUserId()) && !c.isRevoked())
                .filter(c -> c.getFileUrl() != null && !c.getFileUrl().isBlank());
        if (certOpt.isEmpty()) return ResponseEntity.notFound().build();
        try {
            CertificateEntity c = certOpt.get();
            String relativePath = c.getFileUrl().replaceFirst("^/uploads/", "");
            Path path = Path.of(uploadDir).resolve(relativePath).normalize();
            if (!Files.exists(path) || !Files.isReadable(path)) return ResponseEntity.notFound().build();
            byte[] pdfBytes = Files.readAllBytes(path);
            TraineeDetails trainee = getTraineeByIdUseCase.getById(identity.getUserId()).orElse(null);
            if (trainee == null) return ResponseEntity.notFound().build();
            String traineeName = trainee.getFirstName() + " " + trainee.getLastName();
            traineeNotificationPort.sendCertificateEmail(trainee.getEmail(), traineeName, "Certificate", pdfBytes);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    public record TraineeCertificateResponse(String id, String courseId, String courseTitle, String certificateNumber, String issuedDate, int finalScorePercent, String fileUrl) {}
}
