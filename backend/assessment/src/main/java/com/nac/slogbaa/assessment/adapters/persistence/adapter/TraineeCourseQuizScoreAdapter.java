package com.nac.slogbaa.assessment.adapters.persistence.adapter;

import com.nac.slogbaa.assessment.adapters.persistence.repository.JpaQuizAttemptRepository;
import com.nac.slogbaa.shared.ports.TraineeCourseQuizScorePort;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
public class TraineeCourseQuizScoreAdapter implements TraineeCourseQuizScorePort {

    private final JpaQuizAttemptRepository attemptRepository;

    public TraineeCourseQuizScoreAdapter(JpaQuizAttemptRepository attemptRepository) {
        this.attemptRepository = attemptRepository;
    }

    @Override
    public Optional<Integer> getBestPassedScorePercent(UUID traineeId, UUID courseId) {
        return attemptRepository.findBestPassedScoreForTraineeAndCourse(traineeId, courseId)
                .map(p -> {
                    int total = p.getTotalPoints();
                    return total > 0 ? (100 * p.getPointsEarned() / total) : 0;
                });
    }
}
