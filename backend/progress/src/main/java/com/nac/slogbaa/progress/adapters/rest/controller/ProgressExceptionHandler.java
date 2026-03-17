package com.nac.slogbaa.progress.adapters.rest.controller;

import com.nac.slogbaa.progress.core.exception.AlreadyEnrolledException;
import com.nac.slogbaa.progress.core.exception.CourseNotPublishedException;
import com.nac.slogbaa.progress.core.exception.PrerequisiteNotMetException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class ProgressExceptionHandler {

    @ExceptionHandler(CourseNotPublishedException.class)
    public ProblemDetail handleCourseNotPublished(CourseNotPublishedException e) {
        ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
        detail.setTitle("Course not found or not published");
        return detail;
    }

    @ExceptionHandler(AlreadyEnrolledException.class)
    public ProblemDetail handleAlreadyEnrolled(AlreadyEnrolledException e) {
        ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, e.getMessage());
        detail.setTitle("Already enrolled");
        return detail;
    }

    @ExceptionHandler(PrerequisiteNotMetException.class)
    public ProblemDetail handlePrerequisiteNotMet(PrerequisiteNotMetException e) {
        ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, e.getMessage());
        detail.setTitle("Prerequisite not met");
        return detail;
    }
}
