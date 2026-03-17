package com.nac.slogbaa.iam.adapters.rest.controller;

import com.nac.slogbaa.iam.adapters.rest.dto.request.DeleteAccountRequest;
import com.nac.slogbaa.iam.application.dto.result.TraineeDataExportResult;
import com.nac.slogbaa.iam.application.port.in.ExportTraineeDataUseCase;
import com.nac.slogbaa.iam.application.port.in.SoftDeleteAccountUseCase;
import com.nac.slogbaa.iam.application.port.out.TraineeRepositoryPort;
import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import com.nac.slogbaa.shared.ports.FileStoragePort;
import com.nac.slogbaa.shared.ports.file.FileStorageException;
import com.nac.slogbaa.shared.ports.file.FileUploadResult;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Set;

/**
 * REST controller for trainee self-service account management (GDPR + avatar).
 * Provides data export, account deletion, and avatar upload endpoints.
 */
@RestController
@RequestMapping("/api/me")
public class TraineeAccountController {

    private static final Logger log = LoggerFactory.getLogger(TraineeAccountController.class);

    private static final long MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
    private static final Set<String> ALLOWED_AVATAR_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp"
    );

    // Magic bytes for content sniffing
    private static final byte[] JPEG_MAGIC = {(byte) 0xFF, (byte) 0xD8, (byte) 0xFF};
    private static final byte[] PNG_MAGIC = {(byte) 0x89, 0x50, 0x4E, 0x47};
    private static final byte[] RIFF_MAGIC = {0x52, 0x49, 0x46, 0x46};

    private final ExportTraineeDataUseCase exportTraineeDataUseCase;
    private final SoftDeleteAccountUseCase softDeleteAccountUseCase;
    private final FileStoragePort fileStoragePort;
    private final TraineeRepositoryPort traineeRepository;

    public TraineeAccountController(ExportTraineeDataUseCase exportTraineeDataUseCase,
                                    SoftDeleteAccountUseCase softDeleteAccountUseCase,
                                    FileStoragePort fileStoragePort,
                                    TraineeRepositoryPort traineeRepository) {
        this.exportTraineeDataUseCase = exportTraineeDataUseCase;
        this.softDeleteAccountUseCase = softDeleteAccountUseCase;
        this.fileStoragePort = fileStoragePort;
        this.traineeRepository = traineeRepository;
    }

    /**
     * GDPR Article 20 - Right to data portability.
     * Returns all trainee data as a downloadable JSON file.
     */
    @GetMapping("/data-export")
    @PreAuthorize("hasRole('TRAINEE')")
    public ResponseEntity<TraineeDataExportResult> exportMyData(
            @AuthenticationPrincipal AuthenticatedIdentity identity) {
        TraineeDataExportResult data = exportTraineeDataUseCase.export(identity.getUserId());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentDisposition(
                ContentDisposition.attachment()
                        .filename("my-data-export.json")
                        .build()
        );

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_JSON)
                .body(data);
    }

    /**
     * GDPR Article 17 - Right to erasure (soft-delete).
     * Marks the trainee account as deleted without hard-deleting data.
     */
    @DeleteMapping("/account")
    @PreAuthorize("hasRole('TRAINEE')")
    public ResponseEntity<Void> deleteMyAccount(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @RequestParam(required = false) String reason) {
        softDeleteAccountUseCase.softDelete(identity.getUserId(), reason);
        return ResponseEntity.noContent().build();
    }

    /**
     * Upload avatar image for the authenticated trainee.
     * Validates file size (max 2 MB), content type (JPEG/PNG/WebP), and magic bytes.
     */
    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('TRAINEE')")
    public ResponseEntity<Map<String, String>> uploadAvatar(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @RequestParam("file") MultipartFile file) {

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "No file provided"));
        }

        if (file.getSize() > MAX_AVATAR_SIZE_BYTES) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                    .body(Map.of("error", "File too large. Maximum size is 2 MB."));
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_AVATAR_TYPES.contains(contentType)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid file type. Allowed: JPEG, PNG, WebP."));
        }

        try {
            byte[] content = file.getBytes();

            if (!matchesMagicBytes(content, contentType)) {
                log.warn("Avatar upload rejected for trainee {}: MIME type {} does not match magic bytes",
                        identity.getUserId(), contentType);
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "File content does not match declared type."));
            }

            FileUploadResult result = fileStoragePort.store(
                    content,
                    file.getOriginalFilename() != null ? file.getOriginalFilename() : "avatar",
                    contentType,
                    "profiles"
            );

            traineeRepository.updateProfileImage(identity.getUserId(), result.url());

            return ResponseEntity.ok(Map.of("url", result.url()));

        } catch (FileStorageException e) {
            log.error("File storage error during avatar upload for trainee {}", identity.getUserId(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Avatar upload failed. Please try again later."));
        } catch (Exception e) {
            log.error("Unexpected error during avatar upload for trainee {}", identity.getUserId(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Avatar upload failed. Please try again later."));
        }
    }

    private boolean matchesMagicBytes(byte[] content, String contentType) {
        if (content.length < 4) {
            return false;
        }
        return switch (contentType) {
            case "image/jpeg" -> startsWith(content, JPEG_MAGIC);
            case "image/png" -> startsWith(content, PNG_MAGIC);
            case "image/webp" -> startsWith(content, RIFF_MAGIC) && content.length >= 12
                    && content[8] == 'W' && content[9] == 'E'
                    && content[10] == 'B' && content[11] == 'P';
            default -> false;
        };
    }

    private static boolean startsWith(byte[] data, byte[] prefix) {
        if (data.length < prefix.length) return false;
        for (int i = 0; i < prefix.length; i++) {
            if (data[i] != prefix[i]) return false;
        }
        return true;
    }
}
