package com.nac.slogbaa.learning.adapters.rest.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * REST request for creating a course.
 */
public record CreateCourseRequest(
        @NotBlank(message = "Title is required")
        @Size(max = 500)
        String title,

        String description
) {}
