package com.nac.slogbaa.progress.application.port.in;

import com.nac.slogbaa.progress.application.dto.ResumePoint;

import java.util.Optional;
import java.util.UUID;

/**
 * Use case: get trainee's resume point for a course.
 */
public interface GetResumePointUseCase {

    Optional<ResumePoint> getResumePoint(UUID traineeId, UUID courseId);
}
