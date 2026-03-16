package com.nac.slogbaa.iam.adapters.rest.controller;

import com.nac.slogbaa.iam.adapters.rest.dto.request.PasswordResetConfirmRequest;
import com.nac.slogbaa.iam.adapters.rest.dto.request.PasswordResetRequestRequest;
import com.nac.slogbaa.iam.adapters.rest.dto.response.MessageResponse;
import com.nac.slogbaa.iam.application.port.in.PasswordResetUseCase;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for password reset flow.
 */
@RestController
@RequestMapping("/api/auth/password-reset")
public class PasswordResetController {

    private static final String SUCCESS_MESSAGE = "If an account exists for this email, you will receive a reset link shortly.";
    private static final String RESET_SUCCESS_MESSAGE = "Password has been reset successfully.";

    private final PasswordResetUseCase passwordResetUseCase;

    public PasswordResetController(PasswordResetUseCase passwordResetUseCase) {
        this.passwordResetUseCase = passwordResetUseCase;
    }

    /**
     * Initiate password reset. Returns generic success message even if email doesn't exist (security).
     */
    @PostMapping("/request")
    public ResponseEntity<MessageResponse> requestReset(@Valid @RequestBody PasswordResetRequestRequest request) {
        passwordResetUseCase.initiateReset(request.getEmail().trim().toLowerCase());
        return ResponseEntity.ok(new MessageResponse(SUCCESS_MESSAGE));
    }

    /**
     * Verify reset token. Returns 200 if valid, 400 if expired/invalid.
     */
    @GetMapping("/verify")
    public ResponseEntity<MessageResponse> verifyToken(@RequestParam("token") String token) {
        boolean valid = passwordResetUseCase.validateResetToken(token);
        if (valid) {
            return ResponseEntity.ok(new MessageResponse("Token is valid."));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new MessageResponse("Password reset link is invalid or has expired."));
    }

    /**
     * Complete password reset with token and new password.
     */
    @PostMapping("/confirm")
    public ResponseEntity<MessageResponse> confirmReset(@Valid @RequestBody PasswordResetConfirmRequest request) {
        passwordResetUseCase.completeReset(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok(new MessageResponse(RESET_SUCCESS_MESSAGE));
    }
}
