package com.nac.slogbaa.iam.adapters.rest.controller;

import com.nac.slogbaa.iam.application.dto.command.AuthenticationCommand;
import com.nac.slogbaa.iam.application.dto.command.RegisterTraineeCommand;
import com.nac.slogbaa.iam.application.dto.result.AuthenticationResult;
import com.nac.slogbaa.iam.application.dto.result.RegisterTraineeResult;
import com.nac.slogbaa.iam.application.port.in.AuthenticateUserUseCase;
import com.nac.slogbaa.iam.application.port.in.RegisterTraineeUseCase;
import com.nac.slogbaa.iam.adapters.rest.dto.request.LoginRequest;
import com.nac.slogbaa.iam.adapters.rest.dto.request.RegisterTraineeRequest;
import com.nac.slogbaa.iam.adapters.rest.dto.response.AuthResponse;
import com.nac.slogbaa.iam.adapters.rest.dto.response.RegisterResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for auth. Uses only application port (use case) APIs; no direct adapter or core dependency.
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticateUserUseCase authenticateUserUseCase;
    private final RegisterTraineeUseCase registerTraineeUseCase;

    public AuthController(AuthenticateUserUseCase authenticateUserUseCase,
                          RegisterTraineeUseCase registerTraineeUseCase) {
        this.authenticateUserUseCase = authenticateUserUseCase;
        this.registerTraineeUseCase = registerTraineeUseCase;
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
}
