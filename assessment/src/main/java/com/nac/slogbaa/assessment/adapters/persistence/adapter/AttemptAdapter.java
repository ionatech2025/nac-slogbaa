package com.nac.slogbaa.assessment.adapters.persistence.adapter;

import com.nac.slogbaa.assessment.application.dto.*;
import com.nac.slogbaa.assessment.application.port.out.AttemptPort;
import com.nac.slogbaa.assessment.adapters.persistence.entity.*;
import com.nac.slogbaa.assessment.adapters.persistence.repository.JpaQuizAttemptRepository;
import com.nac.slogbaa.assessment.adapters.persistence.repository.JpaQuizRepository;
import com.nac.slogbaa.assessment.adapters.persistence.repository.JpaTraineeAssessmentRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Component
public class AttemptAdapter implements AttemptPort {

    private final JpaQuizRepository quizRepository;
    private final JpaTraineeAssessmentRepository traineeAssessmentRepository;
    private final JpaQuizAttemptRepository attemptRepository;

    public AttemptAdapter(JpaQuizRepository quizRepository,
                          JpaTraineeAssessmentRepository traineeAssessmentRepository,
                          JpaQuizAttemptRepository attemptRepository) {
        this.quizRepository = quizRepository;
        this.traineeAssessmentRepository = traineeAssessmentRepository;
        this.attemptRepository = attemptRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<QuizForAttemptDto> getQuizForAttempt(UUID quizId) {
        return quizRepository.findById(quizId)
                .filter(q -> !q.getQuestions().isEmpty())
                .map(this::toQuizForAttempt);
    }

    @Override
    @Transactional
    public AttemptDto startAttempt(UUID traineeId, UUID quizId, UUID moduleId) {
        QuizEntity quiz = quizRepository.findById(quizId).orElseThrow(() -> new NoSuchElementException("Quiz not found: " + quizId));
        TraineeAssessmentEntity assessment = traineeAssessmentRepository.findByTraineeIdAndQuizId(traineeId, quizId)
                .orElseGet(() -> {
                    TraineeAssessmentEntity a = new TraineeAssessmentEntity();
                    a.setTraineeId(traineeId);
                    a.setQuiz(quiz);
                    a.setModuleId(moduleId);
                    return traineeAssessmentRepository.save(a);
                });

        List<QuizAttemptEntity> existing = attemptRepository.findByTraineeAssessmentIdOrderByAttemptNumberDesc(assessment.getId());
        int nextNumber = existing.isEmpty() ? 1 : existing.get(0).getAttemptNumber() + 1;

        QuizAttemptEntity attempt = new QuizAttemptEntity();
        attempt.setTraineeAssessment(assessment);
        attempt.setAttemptNumber(nextNumber);
        attempt.setStartedAt(Instant.now());
        attempt.setTotalPoints(quiz.getQuestions().stream().mapToInt(QuestionEntity::getPoints).sum());
        attempt = attemptRepository.save(attempt);

        return new AttemptDto(
                attempt.getId(),
                assessment.getId(),
                attempt.getAttemptNumber(),
                attempt.getStartedAt(),
                toQuizForAttempt(quiz)
        );
    }

    @Override
    @Transactional
    public SubmittedAttemptDto submitAttempt(UUID attemptId, UUID traineeId, List<AnswerSubmission> answers) {
        QuizAttemptEntity attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new NoSuchElementException("Attempt not found: " + attemptId));
        if (!attempt.getTraineeAssessment().getTraineeId().equals(traineeId)) {
            throw new SecurityException("Attempt does not belong to trainee");
        }
        if (attempt.getCompletedAt() != null) {
            return new SubmittedAttemptDto(
                    attempt.getId(),
                    attempt.getPointsEarned(),
                    attempt.getTotalPoints(),
                    attempt.getTotalPoints() > 0 ? (100 * attempt.getPointsEarned() / attempt.getTotalPoints()) : 0,
                    attempt.isPassed(),
                    attempt.getCompletedAt()
            );
        }

        QuizEntity quiz = attempt.getTraineeAssessment().getQuiz();
        Map<UUID, QuestionEntity> questionMap = new HashMap<>();
        for (QuestionEntity q : quiz.getQuestions()) {
            questionMap.put(q.getId(), q);
        }

        int pointsEarned = 0;
        for (AnswerSubmission sub : answers) {
            QuestionEntity q = questionMap.get(sub.questionId());
            if (q == null) continue;
            int awarded = 0;
            boolean correct = false;
            if (q.getQuestionType().equals("MULTIPLE_CHOICE") || q.getQuestionType().equals("TRUE_FALSE")) {
                UUID correctOptionId = q.getOptions().stream().filter(QuizOptionEntity::isCorrect).map(QuizOptionEntity::getId).findFirst().orElse(null);
                correct = correctOptionId != null && correctOptionId.equals(sub.selectedOptionId());
                awarded = correct ? q.getPoints() : 0;
            }
            pointsEarned += awarded;

            QuizAnswerEntity answer = new QuizAnswerEntity();
            answer.setQuizAttempt(attempt);
            answer.setQuestionId(q.getId());
            answer.setSelectedOptionId(sub.selectedOptionId());
            answer.setTextAnswer(sub.textAnswer());
            answer.setCorrect(correct);
            answer.setPointsAwarded(awarded);
            attempt.getAnswers().add(answer);
        }

        attempt.setPointsEarned(pointsEarned);
        attempt.setCompletedAt(Instant.now());
        int totalPoints = attempt.getTotalPoints();
        int percent = totalPoints > 0 ? (100 * pointsEarned / totalPoints) : 0;
        attempt.setPassed(percent >= quiz.getPassThresholdPercent());
        attemptRepository.save(attempt);

        return new SubmittedAttemptDto(
                attempt.getId(),
                pointsEarned,
                totalPoints,
                percent,
                attempt.isPassed(),
                attempt.getCompletedAt()
        );
    }

    private QuizForAttemptDto toQuizForAttempt(QuizEntity e) {
        return new QuizForAttemptDto(
                e.getId(),
                e.getModuleId(),
                e.getTitle(),
                e.getPassThresholdPercent(),
                e.getMaxAttempts(),
                e.getTimeLimitMinutes(),
                e.getQuestions().stream()
                        .map(this::toQuestionForAttempt)
                        .toList()
        );
    }

    private QuestionForAttemptDto toQuestionForAttempt(QuestionEntity q) {
        return new QuestionForAttemptDto(
                q.getId(),
                q.getQuestionText(),
                q.getQuestionType(),
                q.getPoints(),
                q.getQuestionOrder(),
                q.getOptions().stream()
                        .map(o -> new OptionForAttemptDto(o.getId(), o.getOptionText(), o.getOptionOrder()))
                        .toList()
        );
    }
}
