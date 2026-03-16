package com.nac.slogbaa.assessment.adapters.rest.controller;

import com.nac.slogbaa.assessment.adapters.persistence.repository.JpaQuizAttemptRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
    public ResponseEntity<List<AttemptResponse>> list() {
        List<AttemptResponse> body = attemptRepository.findAllCompletedForAdmin().stream()
                .map(p -> new AttemptResponse(
                        p.getId().toString(),
                        p.getTraineeId().toString(),
                        p.getTraineeName(),
                        p.getCourseId().toString(),
                        p.getCourseTitle(),
                        p.getModuleId().toString(),
                        p.getModuleTitle(),
                        p.getQuizTitle(),
                        p.getAttemptNumber(),
                        p.getPointsEarned(),
                        p.getTotalPoints(),
                        p.getTotalPoints() > 0 ? (100 * p.getPointsEarned() / p.getTotalPoints()) : 0,
                        p.isPassed(),
                        p.getCompletedAt() != null ? p.getCompletedAt().toString() : null
                ))
                .toList();
        return ResponseEntity.ok(body);
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
