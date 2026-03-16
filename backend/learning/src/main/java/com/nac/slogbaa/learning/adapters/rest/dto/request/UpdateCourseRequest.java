package com.nac.slogbaa.learning.adapters.rest.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

/**
 * REST request for updating a course.
 */
public record UpdateCourseRequest(
        @NotBlank(message = "Title is required")
        @Size(max = 500)
        String title,

        String description,

        @Size(max = 2048)
        String imageUrl,

        UUID categoryId
) {}
