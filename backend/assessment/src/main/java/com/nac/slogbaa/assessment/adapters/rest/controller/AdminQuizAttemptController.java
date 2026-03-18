package com.nac.slogbaa.assessment.adapters.rest.controller;

import com.nac.slogbaa.assessment.adapters.persistence.repository.JpaQuizAttemptRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for admin quiz attempts listing.
 * ADMIN and SUPER_ADMIN can view.
 */
@RestController
@RequestMapping("/api/admin/assessment/attempts")
@PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
public class AdminQuizAttemptController {

    private final JpaQuizAttemptRepository attemptRepository;

    public AdminQuizAttemptController(JpaQuizAttemptRepository attemptRepository) {
        this.attemptRepository = attemptRepository;
    }

    @GetMapping
    public ResponseEntity<Page<AttemptResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 100), Sort.by("completedAt").descending());
        Page<AttemptResponse> result = attemptRepository.findAllCompletedForAdminPaged(pageable)
                .map(p -> new AttemptResponse(
                        str(p.getId()), str(p.getTraineeId()), p.getTraineeName(),
                        str(p.getCourseId()), p.getCourseTitle(),
                        str(p.getModuleId()), p.getModuleTitle(), p.getQuizTitle(),
                        p.getAttemptNumber(),
                        p.getPointsEarned(), p.getTotalPoints(),
                        p.getTotalPoints() > 0 ? (int) Math.round(p.getPointsEarned() * 100.0 / p.getTotalPoints()) : 0,
                        p.isPassed(),
                        p.getCompletedAt() != null ? p.getCompletedAt().toString() : null
                ));
        return ResponseEntity.ok(result);
    }

    private static String str(Object o) {
        return o != null ? o.toString() : null;
    }

    public record AttemptResponse(
            String id,
            String traineeId,
            String traineeName,
            String courseId,
            String courseTitle,
            String moduleId,
            String moduleTitle,
            String quizTitle,
            int attemptNumber,
            int pointsEarned,
            int totalPoints,
            int scorePercent,
            boolean passed,
            String completedAt
    ) {}
}
