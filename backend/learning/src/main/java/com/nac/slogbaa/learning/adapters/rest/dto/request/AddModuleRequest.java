package com.nac.slogbaa.learning.adapters.rest.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * REST request for adding a module to a course.
 * moduleOrder and hasQuiz are optional (default 0 and false when omitted from JSON).
 */
public record AddModuleRequest(
        @NotBlank(message = "Title is required")
        @Size(max = 500)
        String title,

        String description,

        @Size(max = 2048)
        String imageUrl,

        @Min(0)
        Integer moduleOrder,

        Boolean hasQuiz
) {
    public AddModuleRequest {
        if (moduleOrder == null) moduleOrder = 0;
        if (hasQuiz == null) hasQuiz = false;
    }
}
