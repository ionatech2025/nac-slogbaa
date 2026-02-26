package com.nac.slogbaa.learning.adapters.rest.controller;

import com.nac.slogbaa.learning.core.exception.ContentBlockNotFoundException;
import com.nac.slogbaa.learning.core.exception.CourseNotFoundException;
import com.nac.slogbaa.learning.core.exception.ModuleNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Maps learning domain exceptions to HTTP responses (e.g. 404 for not found).
 */
@RestControllerAdvice
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
}
