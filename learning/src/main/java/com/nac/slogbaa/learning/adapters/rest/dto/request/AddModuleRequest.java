package com.nac.slogbaa.learning.adapters.rest.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * REST request for adding a module to a course.
 */
public record AddModuleRequest(
        @NotBlank(message = "Title is required")
        @Size(max = 500)
        String title,

        String description,

        @Min(0)
        int moduleOrder,

        boolean hasQuiz
) {}
