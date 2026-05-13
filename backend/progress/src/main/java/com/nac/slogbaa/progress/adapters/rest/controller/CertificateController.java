package com.nac.slogbaa.progress.adapters.rest.controller;

import com.nac.slogbaa.iam.application.dto.result.TraineeDetails;
import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import com.nac.slogbaa.progress.adapters.persistence.entity.CertificateEntity;
import com.nac.slogbaa.progress.adapters.persistence.repository.JpaCertificateRepository;
import com.nac.slogbaa.progress.adapters.persistence.repository.JpaCertificateRepository.CertificateModuleProjection;
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
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
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

    /**
     * GET /api/certificates/{id}
     * Returns full certificate detail for rendering the frontend certificate template.
     * Includes recipient name (from IAM), course title, issue date, certificate number,
     * and the list of completed modules (title + description).
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('TRAINEE')")
    public ResponseEntity<CertificateDetailResponse> detail(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @PathVariable UUID id) {

        // 1. Load and ownership-check the certificate
        var certOpt = certificateRepository.findById(id)
                .filter(c -> c.getTraineeId().equals(identity.getUserId()) && !c.isRevoked());
        if (certOpt.isEmpty()) return ResponseEntity.notFound().build();
        CertificateEntity cert = certOpt.get();

        // 2. Resolve trainee full name from IAM
        String recipientName = getTraineeByIdUseCase.getById(identity.getUserId())
                .map(t -> t.getFirstName() + " " + t.getLastName())
                .orElse("Unknown");

        // 3. Load completed modules for this trainee + course
        List<CertificateModuleProjection> rawModules =
                certificateRepository.findCompletedModulesForCertificate(
                        identity.getUserId(), cert.getCourseId());
        List<ModuleItem> modules = rawModules.stream()
                .map(m -> new ModuleItem(m.getTitle(), m.getDescription()))
                .toList();

        // 4. Format the issued date as a human-readable string
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMMM d, yyyy", Locale.ENGLISH);
        String formattedDate = cert.getIssuedDate().format(fmt);

        // 5. Retrieve course title via the list projection (already joined in repo)
        String courseTitle = certificateRepository
                .findTraineeCertificatesWithCourse(identity.getUserId()).stream()
                .filter(c -> c.getId().equals(cert.getId()))
                .findFirst()
                .map(c -> c.getCourseTitle())
                .orElse("");

        var body = new CertificateDetailResponse(
                cert.getId().toString(),
                courseTitle,
                recipientName,
                formattedDate,
                cert.getCertificateNumber(),
                modules
        );
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

    /** List item — used by GET /api/certificates */
    public record TraineeCertificateResponse(
            String id,
            String courseId,
            String courseTitle,
            String certificateNumber,
            String issuedDate,
            int finalScorePercent,
            String fileUrl) {}

    /** Single module item within a certificate detail response */
    public record ModuleItem(String title, String description) {}

    /** Full detail response — used by GET /api/certificates/{id} */
    public record CertificateDetailResponse(
            String id,
            String courseTitle,
            String recipientName,
            String completionDate,
            String certificateId,
            List<ModuleItem> modules) {}
}
