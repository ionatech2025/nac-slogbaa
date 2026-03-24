package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.learning.application.port.out.CoursePublicationPort;
import com.nac.slogbaa.progress.adapters.persistence.entity.CourseStaffReviewEntity;
import com.nac.slogbaa.progress.application.port.in.SubmitStaffCourseReviewUseCase;
import com.nac.slogbaa.progress.application.port.out.CourseStaffReviewPort;

import java.util.UUID;

public final class SubmitStaffCourseReviewService implements SubmitStaffCourseReviewUseCase {

    private final CourseStaffReviewPort courseStaffReviewPort;
    private final CoursePublicationPort coursePublicationPort;
    private final CourseReviewStaffNotificationService courseReviewStaffNotificationService;

    public SubmitStaffCourseReviewService(CourseStaffReviewPort courseStaffReviewPort,
                                          CoursePublicationPort coursePublicationPort,
                                          CourseReviewStaffNotificationService courseReviewStaffNotificationService) {
        this.courseStaffReviewPort = courseStaffReviewPort;
        this.coursePublicationPort = coursePublicationPort;
        this.courseReviewStaffNotificationService = courseReviewStaffNotificationService;
    }

    @Override
    public void submit(UUID staffUserId, UUID courseId, int rating, String reviewText) {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        if (!coursePublicationPort.isPublished(courseId)) {
            throw new IllegalStateException("Course must be published to review");
        }

        CourseStaffReviewEntity entity = courseStaffReviewPort.findByStaffUserAndCourse(staffUserId, courseId)
                .orElseGet(() -> {
                    CourseStaffReviewEntity e = new CourseStaffReviewEntity();
                    e.setStaffUserId(staffUserId);
                    e.setCourseId(courseId);
                    return e;
                });
        entity.setRating((short) rating);
        entity.setReviewText(reviewText);
        courseStaffReviewPort.save(entity);

        try {
            courseReviewStaffNotificationService.notifyReviewSubmitted(courseId, staffUserId);
        } catch (Exception ignored) {
            // notifications must not break review flow
        }
    }
}
