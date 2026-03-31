package com.nac.slogbaa.iam.adapters.rest.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
public class TestEmailRequest {
    @NotBlank(message = "Recipient email is required")
    @Email(message = "Valid recipient email is required")
    String to;

    @NotBlank(message = "Subject is required")
    String subject;

    @NotBlank(message = "Content is required")
    String content;
}
