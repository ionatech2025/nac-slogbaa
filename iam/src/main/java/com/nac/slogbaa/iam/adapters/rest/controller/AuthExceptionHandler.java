package com.nac.slogbaa.iam.adapters.rest.controller;

import com.nac.slogbaa.iam.core.exception.CannotDeleteLastSuperAdminException;
import com.nac.slogbaa.iam.core.exception.CannotDeleteSelfException;
import com.nac.slogbaa.iam.core.exception.DuplicateEmailException;
import com.nac.slogbaa.iam.core.exception.InvalidCredentialsException;
import com.nac.slogbaa.iam.core.exception.InvalidCurrentPasswordException;
import com.nac.slogbaa.iam.core.exception.StaffCannotSelfRegisterException;
import com.nac.slogbaa.iam.core.exception.StaffNotFoundException;
import com.nac.slogbaa.iam.core.exception.StaffRoleLimitReachedException;
import com.nac.slogbaa.iam.core.exception.TraineeNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Maps core IAM exceptions to HTTP responses. Controllers use core APIs only; this adapter maps failures.
 */
@RestControllerAdvice
public class AuthExceptionHandler {

    @ExceptionHandler(InvalidCredentialsException.class)
    public ProblemDetail handleInvalidCredentials(InvalidCredentialsException e) {
        ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, e.getMessage());
        detail.setTitle("Invalid credentials");
        return detail;
    }

    @ExceptionHandler(InvalidCurrentPasswordException.class)
    public ProblemDetail handleInvalidCurrentPassword(InvalidCurrentPasswordException e) {
        ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, e.getMessage());
        detail.setTitle("Invalid current password");
        return detail;
    }

    @ExceptionHandler(DuplicateEmailException.class)
    public ProblemDetail handleDuplicateEmail(DuplicateEmailException e) {
        ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, e.getMessage());
        detail.setTitle("Duplicate email");
        return detail;
    }

    @ExceptionHandler(StaffCannotSelfRegisterException.class)
    public ProblemDetail handleStaffCannotSelfRegister(StaffCannotSelfRegisterException e) {
        ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, e.getMessage());
        detail.setTitle("Staff cannot register");
        return detail;
    }

    @ExceptionHandler(StaffRoleLimitReachedException.class)
    public ProblemDetail handleStaffRoleLimitReached(StaffRoleLimitReachedException e) {
        ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, e.getMessage());
        detail.setTitle("Staff role limit reached");
        return detail;
    }

    @ExceptionHandler(TraineeNotFoundException.class)
    public ProblemDetail handleTraineeNotFound(TraineeNotFoundException e) {
        ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
        detail.setTitle("Trainee not found");
        return detail;
    }

    @ExceptionHandler(StaffNotFoundException.class)
    public ProblemDetail handleStaffNotFound(StaffNotFoundException e) {
        ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
        detail.setTitle("Staff not found");
        return detail;
    }

    @ExceptionHandler(CannotDeleteLastSuperAdminException.class)
    public ProblemDetail handleCannotDeleteLastSuperAdmin(CannotDeleteLastSuperAdminException e) {
        ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, e.getMessage());
        detail.setTitle("Cannot delete last Super Admin");
        return detail;
    }

    @ExceptionHandler(CannotDeleteSelfException.class)
    public ProblemDetail handleCannotDeleteSelf(CannotDeleteSelfException e) {
        ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, e.getMessage());
        detail.setTitle("Cannot delete own account");
        return detail;
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ProblemDetail handleBadRequest(IllegalArgumentException e) {
        ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, e.getMessage());
        detail.setTitle("Invalid request");
        return detail;
    }
}
