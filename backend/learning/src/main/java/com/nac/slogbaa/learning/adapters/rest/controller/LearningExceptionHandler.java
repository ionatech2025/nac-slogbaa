package com.nac.slogbaa.learning.adapters.rest.controller;

import com.nac.slogbaa.learning.core.exception.ContentBlockNotFoundException;
import com.nac.slogbaa.learning.core.exception.CourseHasEnrollmentsException;
import com.nac.slogbaa.learning.core.exception.CourseNotFoundException;
import com.nac.slogbaa.learning.core.exception.LibraryResourceNotFoundException;
import com.nac.slogbaa.learning.core.exception.ModuleHasCompletionsException;
import com.nac.slogbaa.learning.core.exception.ModuleNotFoundException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Maps learning domain exceptions to HTTP responses (e.g. 404 for not found).
 */
@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class LearningExceptionHandler {

    @ExceptionHandler(CourseNotFoundException.class)
    public ProblemDetail handleCourseNotFound(CourseNotFoundException e) {
        ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
        detail.setTitle("Course not found");
        return detail;
    }

    @ExceptionHandler(ModuleNotFoundException.class)
    public ProblemDetail handleModuleNotFound(ModuleNotFoundException e) {
        ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
        detail.setTitle("Module not found");
        return detail;
    }

    @ExceptionHandler(ContentBlockNotFoundException.class)
    public ProblemDetail handleContentBlockNotFound(ContentBlockNotFoundException e) {
        ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
        detail.setTitle("Content block not found");
        return detail;
    }

    @ExceptionHandler(LibraryResourceNotFoundException.class)
    public ProblemDetail handleLibraryResourceNotFound(LibraryResourceNotFoundException e) {
        ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
        detail.setTitle("Library resource not found");
        return detail;
    }

    @ExceptionHandler(CourseHasEnrollmentsException.class)
    public ProblemDetail handleCourseHasEnrollments(CourseHasEnrollmentsException e) {
        ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, e.getMessage());
        detail.setTitle("Course cannot be deleted");
        return detail;
    }

    @ExceptionHandler(ModuleHasCompletionsException.class)
    public ProblemDetail handleModuleHasCompletions(ModuleHasCompletionsException e) {
        ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, e.getMessage());
        detail.setTitle("Module cannot be deleted");
        return detail;
    }
}
