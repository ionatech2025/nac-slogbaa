package com.nac.slogbaa.learning.adapters.rest.controller;

import com.nac.slogbaa.learning.core.exception.CourseNotFoundException;
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
}
