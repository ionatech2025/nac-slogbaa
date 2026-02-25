package com.nac.slogbaa.learning.application.port.out;

import com.nac.slogbaa.learning.application.dto.result.CourseSummary;

import java.util.Optional;
import java.util.UUID;

/**
 * Port for querying a single course summary by id. Used by Progress for enrolled courses list.
 */
public interface CourseSummaryQueryPort {

    Optional<CourseSummary> getSummaryByCourseId(UUID courseId);
}
