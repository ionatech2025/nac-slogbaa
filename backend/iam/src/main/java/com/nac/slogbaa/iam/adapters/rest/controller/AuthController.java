package com.nac.slogbaa.iam.adapters.rest.controller;

import com.nac.slogbaa.iam.application.dto.command.AuthenticationCommand;
import com.nac.slogbaa.iam.application.dto.command.RegisterTraineeCommand;
import com.nac.slogbaa.iam.application.dto.result.AuthenticationResult;
import com.nac.slogbaa.iam.application.dto.result.RegisterTraineeResult;
import com.nac.slogbaa.iam.application.port.in.AuthenticateUserUseCase;
import com.nac.slogbaa.iam.application.port.in.RegisterTraineeUseCase;
import com.nac.slogbaa.iam.application.port.in.VerifyEmailUseCase;
import com.nac.slogbaa.iam.adapters.rest.dto.request.LoginRequest;
import com.nac.slogbaa.iam.adapters.rest.dto.request.RegisterTraineeRequest;
import com.nac.slogbaa.iam.adapters.rest.dto.request.ResendVerificationRequest;
import com.nac.slogbaa.iam.adapters.rest.dto.response.AuthResponse;
import com.nac.slogbaa.iam.adapters.rest.dto.response.MessageResponse;
import com.nac.slogbaa.iam.adapters.rest.dto.response.RegisterResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for auth. Uses only application port (use case) APIs; no direct adapter or core dependency.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticateUserUseCase authenticateUserUseCase;
    private final RegisterTraineeUseCase registerTraineeUseCase;
    private final VerifyEmailUseCase verifyEmailUseCase;

    public AuthController(AuthenticateUserUseCase authenticateUserUseCase,
                          RegisterTraineeUseCase registerTraineeUseCase,
                          VerifyEmailUseCase verifyEmailUseCase) {
        this.authenticateUserUseCase = authenticateUserUseCase;
        this.registerTraineeUseCase = registerTraineeUseCase;
        this.verifyEmailUseCase = verifyEmailUseCase;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthenticationCommand command = new AuthenticationCommand(request.getEmail(), request.getPassword());
        AuthenticationResult result = authenticateUserUseCase.authenticate(command);
        AuthResponse response = new AuthResponse(
                result.getToken(),
                result.getUserId(),
                result.getEmail(),
                result.getRole(),
                result.getFullName()
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterTraineeRequest request) {
        RegisterTraineeCommand command = new RegisterTraineeCommand(
                request.getEmail(),
                request.getPassword(),
                request.getFirstName(),
                request.getLastName(),
                request.getGender(),
                request.getTraineeCategory(),
                request.getDistrictName(),
                request.getRegion(),
                request.getStreet(),
                request.getCity(),
                request.getPostalCode(),
                request.getPhoneCountryCode(),
                request.getPhoneNationalNumber()
        );
        RegisterTraineeResult result = registerTraineeUseCase.register(command);
        RegisterResponse response = new RegisterResponse(result.getTraineeId(), result.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/verify-email")
    public ResponseEntity<MessageResponse> verifyEmail(@RequestParam("token") String token) {
        boolean verified = verifyEmailUseCase.verify(token);
        if (verified) {
            return ResponseEntity.ok(new MessageResponse("Email verified successfully."));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new MessageResponse("Verification link is invalid or has expired."));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<MessageResponse> resendVerification(@Valid @RequestBody ResendVerificationRequest request) {
        verifyEmailUseCase.resendVerification(request.getEmail().trim().toLowerCase());
        return ResponseEntity.ok(new MessageResponse(
                "If an account exists for this email, a verification link will be sent shortly."));
    }
}
