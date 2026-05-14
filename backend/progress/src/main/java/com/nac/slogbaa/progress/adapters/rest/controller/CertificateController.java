package com.nac.slogbaa.progress.adapters.rest.controller;

import com.nac.slogbaa.iam.application.dto.result.TraineeDetails;
import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import com.nac.slogbaa.progress.adapters.persistence.entity.CertificateEntity;
import com.nac.slogbaa.progress.adapters.persistence.repository.JpaCertificateRepository;
import com.nac.slogbaa.progress.adapters.persistence.repository.JpaCertificateRepository.CertificateModuleProjection;
import com.nac.slogbaa.shared.ports.FileStoragePort;
import com.nac.slogbaa.shared.ports.TraineeNotificationPort;
import com.nac.slogbaa.iam.application.port.in.GetTraineeByIdUseCase;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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
import java.util.Map;
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
        private final FileStoragePort fileStoragePort;

        public CertificateController(JpaCertificateRepository certificateRepository,
                        @Value("${app.file.upload-dir:uploads}") String uploadDir,
                        GetTraineeByIdUseCase getTraineeByIdUseCase,
                        TraineeNotificationPort traineeNotificationPort,
                        FileStoragePort fileStoragePort) {
                this.certificateRepository = certificateRepository;
                this.uploadDir = uploadDir;
                this.getTraineeByIdUseCase = getTraineeByIdUseCase;
                this.traineeNotificationPort = traineeNotificationPort;
                this.fileStoragePort = fileStoragePort;
        }

        @GetMapping
        @PreAuthorize("hasRole('TRAINEE')")
        public ResponseEntity<List<TraineeCertificateResponse>> list(
                        @AuthenticationPrincipal AuthenticatedIdentity identity) {
                System.out.println("[CertificateController] Listing certificates for trainee: " + identity.getUserId());
                var certs = certificateRepository.findTraineeCertificatesWithCourse(identity.getUserId());
                System.out.println("[CertificateController] Found " + certs.size() + " certificates");
                List<TraineeCertificateResponse> body = certs.stream()
                                .map(c -> new TraineeCertificateResponse(
                                                c.getId().toString(),
                                                c.getCourseId().toString(),
                                                c.getCourseTitle(),
                                                c.getCertificateNumber(),
                                                c.getIssuedDate().toString(),
                                                c.getFinalScorePercent(),
                                                c.getFileUrl()))
                                .toList();
                return ResponseEntity.ok(body);
        }

        /**
         * GET /api/certificates/{id}
         * Returns full certificate detail for rendering the frontend certificate
         * template.
         * Includes recipient name (from IAM), course title, issue date, certificate
         * number,
         * and the list of completed modules (title + description).
         */
        @GetMapping("/{id}")
        @PreAuthorize("hasRole('TRAINEE')")
        public ResponseEntity<CertificateDetailResponse> detail(
                        @AuthenticationPrincipal AuthenticatedIdentity identity,
                        @PathVariable UUID id) {

                // 1. Load and ownership-check the certificate
                System.out.println("[CertificateController] Fetching detail for ID: " + id + " (Requested by trainee: " + identity.getUserId() + ")");
                var certOpt = certificateRepository.findById(id);
                
                if (certOpt.isEmpty()) {
                        System.out.println("[CertificateController] Certificate not found in DB: " + id);
                        return ResponseEntity.notFound().build();
                }

                CertificateEntity cert = certOpt.get();
                System.out.println("[CertificateController] Certificate exists. Owner: " + cert.getTraineeId() + ", Status: " + cert.getStatus());

                if (!cert.getTraineeId().equals(identity.getUserId())) {
                        System.out.println("[CertificateController] Ownership mismatch! Requestor: " + identity.getUserId() + " vs Owner: " + cert.getTraineeId());
                        return ResponseEntity.notFound().build();
                }

                if (cert.isRevoked()) {
                        System.out.println("[CertificateController] Certificate is revoked");
                        return ResponseEntity.notFound().build();
                }

                // 2. Resolve trainee full name from IAM
                String recipientName = getTraineeByIdUseCase.getById(identity.getUserId())
                                .map(t -> t.getFirstName() + " " + t.getLastName())
                                .orElse("Unknown");

                // 3. Load completed modules for this trainee + course
                List<CertificateModuleProjection> rawModules = certificateRepository.findCompletedModulesForCertificate(
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
                                cert.getFileUrl(),
                                modules);
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
                                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                                        "attachment; filename=\"" + filename + "\"")
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
                if (certOpt.isEmpty())
                        return ResponseEntity.notFound().build();
                try {
                        CertificateEntity c = certOpt.get();
                        String relativePath = c.getFileUrl().replaceFirst("^/uploads/", "");
                        Path path = Path.of(uploadDir).resolve(relativePath).normalize();
                        if (!Files.exists(path) || !Files.isReadable(path))
                                return ResponseEntity.notFound().build();
                        byte[] pdfBytes = Files.readAllBytes(path);
                        TraineeDetails trainee = getTraineeByIdUseCase.getById(identity.getUserId()).orElse(null);
                        if (trainee == null)
                                return ResponseEntity.notFound().build();
                        String traineeName = trainee.getFirstName() + " " + trainee.getLastName();
                        traineeNotificationPort.sendCertificateEmail(trainee.getEmail(), traineeName, "Certificate",
                                        pdfBytes);
                        return ResponseEntity.noContent().build();
                } catch (Exception e) {
                        return ResponseEntity.notFound().build();
                }
        }

        /**
         * POST /api/certificates/{id}/upload
         * Allows the frontend to upload an auto-generated PDF for a certificate.
         * Updates the certificate record with the stored file URL.
         */
        @PostMapping(value = "/{id}/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        @PreAuthorize("hasRole('TRAINEE')")
        public ResponseEntity<Map<String, String>> upload(
                        @AuthenticationPrincipal AuthenticatedIdentity identity,
                        @PathVariable UUID id,
                        @RequestParam("file") MultipartFile file) {

                var certOpt = certificateRepository.findById(id)
                                .filter(c -> c.getTraineeId().equals(identity.getUserId()) && !c.isRevoked());

                if (certOpt.isEmpty())
                        return ResponseEntity.notFound().build();
                if (file == null || file.isEmpty())
                        return ResponseEntity.badRequest().build();

                try {
                        CertificateEntity cert = certOpt.get();

                        // Use standard storage port to save into "certificates" bucket
                        var result = fileStoragePort.store(
                                        file.getBytes(),
                                        file.getOriginalFilename() != null ? file.getOriginalFilename()
                                                        : "certificate.pdf",
                                        "application/pdf",
                                        "certificates");

                        // Update entity with new URL
                        cert.setFileUrl(result.url());
                        certificateRepository.save(cert);

                        return ResponseEntity.ok(Map.of("url", result.url()));
                } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
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
                        String fileUrl) {
        }

        /** Single module item within a certificate detail response */
        public record ModuleItem(String title, String description) {
        }

        /** Full detail response — used by GET /api/certificates/{id} */
        public record CertificateDetailResponse(
                        String id,
                        String courseTitle,
                        String recipientName,
                        String completionDate,
                        String certificateId,
                        String fileUrl,
                        List<ModuleItem> modules) {
        }
}
