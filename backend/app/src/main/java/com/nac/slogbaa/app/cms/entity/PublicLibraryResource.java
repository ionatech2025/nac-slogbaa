package com.nac.slogbaa.app.cms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "public_library_resource")
@Getter
@Setter
public class PublicLibraryResource {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceCategory category = ResourceCategory.GENERAL;

    @NotBlank
    @Column(name = "file_url", nullable = false, length = 2048)
    private String fileUrl;

    @Column(name = "image_url", length = 2048)
    private String imageUrl;

    @Column(name = "sort_order")
    private int sortOrder = 0;

    @Column(name = "is_active")
    private boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    public enum ResourceCategory {
        GENERAL, MANUAL, REPORT, POLICY
    }
}
