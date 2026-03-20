package com.nac.slogbaa.infrastructure.storage;

import com.nac.slogbaa.shared.ports.FileStoragePort;
import com.nac.slogbaa.shared.ports.file.FileStorageException;
import com.nac.slogbaa.shared.ports.file.FileUploadResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.net.URI;
import java.util.UUID;
import java.util.regex.Pattern;

/**
 * Cloudflare R2 file storage adapter (S3-compatible).
 * Activated when {@code app.storage.type=r2} is set.
 * Takes priority over {@link LocalFileStorageAdapter} via {@code @Primary}.
 */
@Component
@Primary
@ConditionalOnProperty(name = "app.storage.type", havingValue = "r2")
public class R2FileStorageAdapter implements FileStoragePort {

    private static final Logger log = LoggerFactory.getLogger(R2FileStorageAdapter.class);
    private static final Pattern SAFE_SUBDIR = Pattern.compile("^[a-zA-Z0-9_-]+$");
    private static final Pattern SAFE_EXTENSION = Pattern.compile("^\\.[a-zA-Z0-9]+$");

    private final S3Client s3;
    private final String bucket;
    private final String publicUrl;

    private static String sanitizeForLog(String value) {
        if (value == null) return null;
        // Prevent log injection by removing newlines/control chars.
        return value.replaceAll("[\\r\\n]", " ");
    }

    public R2FileStorageAdapter(
            @Value("${app.storage.r2.account-id}") String accountId,
            @Value("${app.storage.r2.access-key-id}") String accessKeyId,
            @Value("${app.storage.r2.secret-access-key}") String secretAccessKey,
            @Value("${app.storage.r2.bucket}") String bucket,
            @Value("${app.storage.r2.public-url}") String publicUrl) {
        this.bucket = bucket;
        this.publicUrl = publicUrl.replaceAll("/$", "");
        this.s3 = S3Client.builder()
                .endpointOverride(URI.create("https://" + accountId + ".r2.cloudflarestorage.com"))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKeyId, secretAccessKey)))
                .region(Region.of("auto"))
                .forcePathStyle(true)
                .build();
        log.info("R2 storage adapter initialized — bucket={}, publicUrl={}", bucket, this.publicUrl); // nosemgrep
    }

    @Override
    public FileUploadResult store(byte[] content, String originalFilename, String contentType, String subdir) {
        if (content == null || content.length == 0) {
            throw new FileStorageException("File content must not be empty");
        }
        if (subdir == null || !SAFE_SUBDIR.matcher(subdir).matches()) {
            throw new FileStorageException("Invalid subdirectory: " + subdir);
        }

        String extension = extractExtension(originalFilename);
        String key = subdir + "/" + UUID.randomUUID() + extension;

        try {
            s3.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucket)
                            .key(key)
                            .contentType(contentType != null ? contentType : "application/octet-stream")
                            .build(),
                    RequestBody.fromBytes(content));
        } catch (Exception e) {
            String safeKey = key != null ? key.replaceAll("[\\r\\n]", "_") : "null";
            String safeMessage = sanitizeForLog(e.getMessage());
            log.error("R2 upload failed for key={}: {}", safeKey, safeMessage); // nosemgrep
            throw new FileStorageException("Failed to upload file to R2: " + safeMessage, e); // nosemgrep
        }

        String url = publicUrl + "/" + key;
        return new FileUploadResult(url, content.length, contentType != null ? contentType : "application/octet-stream");
    }

    private String extractExtension(String originalFilename) {
        if (originalFilename == null || originalFilename.isBlank()) return "";
        int lastDot = originalFilename.lastIndexOf('.');
        if (lastDot < 0 || lastDot >= originalFilename.length() - 1) return "";
        String ext = "." + originalFilename.substring(lastDot + 1).toLowerCase();
        return SAFE_EXTENSION.matcher(ext).matches() ? ext : "";
    }
}
