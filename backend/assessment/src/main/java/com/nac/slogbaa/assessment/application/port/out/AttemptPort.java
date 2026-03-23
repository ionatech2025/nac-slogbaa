package com.nac.slogbaa.assessment.application.port.out;

import com.nac.slogbaa.assessment.application.dto.AttemptDto;
import com.nac.slogbaa.assessment.application.dto.QuizForAttemptDto;
import com.nac.slogbaa.assessment.application.dto.SubmittedAttemptDto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Port for starting and submitting quiz attempts.
 */
public interface AttemptPort {

    /**
     * Get quiz by id for attempt (questions and options without correct answers).
     * Returns empty if quiz not found or has no questions.
     */
    java.util.Optional<QuizForAttemptDto> getQuizForAttempt(UUID quizId);

    /**
     * Count existing attempts for a trainee on a specific quiz.
     */
    long countAttemptsByTraineeAndQuiz(UUID traineeId, UUID quizId);

    /**
     * Return timing metadata for an attempt (startedAt and quiz timeLimitMinutes).
     * Returns empty if the attempt is not found.
     */
    java.util.Optional<AttemptTimingInfo> getAttemptTimingInfo(UUID attemptId);

    /**
     * Create or get trainee assessment, then create a new attempt. Returns attempt + quiz for attempt.
     */
    AttemptDto startAttempt(UUID traineeId, UUID quizId, UUID moduleId);

    /**
     * Submit answers, compute score, persist attempt result. Pass/fail by quiz threshold.
     * @param attemptId attempt UUID
     * @param answers list of (questionId, selectedOptionId or null, textAnswer or null)
     */
    SubmittedAttemptDto submitAttempt(UUID attemptId, UUID traineeId, List<AnswerSubmission> answers);

    /**
     * Trainee's most recent passed attempt for the module in the given course (for read-only review after completion).
     */
    java.util.Optional<SubmittedAttemptDto> findLatestPassedAttemptReview(UUID traineeId, UUID moduleId, UUID courseId);

    record AnswerSubmission(UUID questionId, UUID selectedOptionId, String textAnswer) {}

    record AttemptTimingInfo(Instant startedAt, Integer timeLimitMinutes) {}
}
