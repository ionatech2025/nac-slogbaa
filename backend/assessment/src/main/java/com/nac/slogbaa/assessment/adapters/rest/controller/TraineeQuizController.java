package com.nac.slogbaa.assessment.adapters.rest.controller;

import com.nac.slogbaa.assessment.application.dto.*;
import com.nac.slogbaa.assessment.application.port.in.GetLatestPassedQuizReviewUseCase;
import com.nac.slogbaa.assessment.application.port.in.GetQuizForAttemptUseCase;
import com.nac.slogbaa.assessment.application.port.in.StartAttemptUseCase;
import com.nac.slogbaa.assessment.application.port.in.SubmitAttemptUseCase;
import com.nac.slogbaa.assessment.application.port.out.AttemptPort;
import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import com.nac.slogbaa.progress.application.port.in.CheckAndAwardBadgesUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Trainee: get quiz (for attempt), start attempt, submit attempt.
 */
@RestController
@RequestMapping("/api/courses/{courseId}/modules/{moduleId}/quiz")
@PreAuthorize("hasRole('TRAINEE')")
public class TraineeQuizController {

    private final GetQuizForAttemptUseCase getQuizForAttemptUseCase;
    private final GetLatestPassedQuizReviewUseCase getLatestPassedQuizReviewUseCase;
    private final StartAttemptUseCase startAttemptUseCase;
    private final SubmitAttemptUseCase submitAttemptUseCase;
    private final CheckAndAwardBadgesUseCase checkAndAwardBadgesUseCase;

    public TraineeQuizController(GetQuizForAttemptUseCase getQuizForAttemptUseCase,
                                GetLatestPassedQuizReviewUseCase getLatestPassedQuizReviewUseCase,
                                StartAttemptUseCase startAttemptUseCase,
                                SubmitAttemptUseCase submitAttemptUseCase,
                                CheckAndAwardBadgesUseCase checkAndAwardBadgesUseCase) {
        this.getQuizForAttemptUseCase = getQuizForAttemptUseCase;
        this.getLatestPassedQuizReviewUseCase = getLatestPassedQuizReviewUseCase;
        this.startAttemptUseCase = startAttemptUseCase;
        this.submitAttemptUseCase = submitAttemptUseCase;
        this.checkAndAwardBadgesUseCase = checkAndAwardBadgesUseCase;
    }

    @GetMapping
    public ResponseEntity<QuizForAttemptResponse> getQuiz(
            @PathVariable UUID courseId,
            @PathVariable UUID moduleId) {
        return getQuizForAttemptUseCase.getByModuleId(moduleId)
                .map(TraineeQuizController::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/last-passed-result")
    public ResponseEntity<SubmittedAttemptResponse> getLastPassedResult(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @PathVariable UUID courseId,
            @PathVariable UUID moduleId) {
        return getLatestPassedQuizReviewUseCase.getReview(identity.getUserId(), courseId, moduleId)
                .map(TraineeQuizController::toSubmittedResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/attempts")
    public ResponseEntity<AttemptResponse> startAttempt(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @PathVariable UUID courseId,
            @PathVariable UUID moduleId) {
        var quizOpt = getQuizForAttemptUseCase.getByModuleId(moduleId);
        if (quizOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        UUID quizId = quizOpt.get().quizId();
        try {
            AttemptDto dto = startAttemptUseCase.start(identity.getUserId(), quizId, moduleId);
            return ResponseEntity.ok(toAttemptResponse(dto));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/attempts/{attemptId}/submit")
    public ResponseEntity<SubmittedAttemptResponse> submitAttempt(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @PathVariable UUID courseId,
            @PathVariable UUID moduleId,
            @PathVariable UUID attemptId,
            @RequestBody SubmitAttemptRequest request) {
        List<AttemptPort.AnswerSubmission> answers = request.answers() == null ? List.of() : request.answers().stream()
                .map(a -> new AttemptPort.AnswerSubmission(a.questionId(), a.selectedOptionId(), a.textAnswer()))
                .toList();
        try {
            SubmittedAttemptDto dto = submitAttemptUseCase.submit(attemptId, identity.getUserId(), answers);
            List<SubmittedAnswerResponse> answerResponses = dto.answers() == null ? List.of() :
                    dto.answers().stream().map(a -> new SubmittedAnswerResponse(
                            a.questionId() != null ? a.questionId().toString() : null,
                            a.questionText(),
                            a.selectedOptionId() != null ? a.selectedOptionId().toString() : null,
                            a.selectedOptionText(),
                            a.correctOptionId() != null ? a.correctOptionId().toString() : null,
                            a.correctOptionText(),
                            a.correct(),
                            a.pointsAwarded(),
                            a.totalPoints()
                    )).toList();
            var response = new SubmittedAttemptResponse(
                    dto.attemptId().toString(),
                    dto.pointsEarned(),
                    dto.totalPoints(),
                    dto.percentScore(),
                    dto.passed(),
                    dto.completedAt().toString(),
                    answerResponses
            );

            // Check for Perfect Score badge (non-blocking)
            try {
                checkAndAwardBadgesUseCase.checkPerfectQuiz(identity.getUserId(), dto.passed(), dto.percentScore());
            } catch (Exception ignored) {
                // Badge checks must never break the main quiz flow
            }

            return ResponseEntity.ok(response);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private static QuizForAttemptResponse toResponse(QuizForAttemptDto dto) {
        return new QuizForAttemptResponse(
                dto.quizId().toString(),
                dto.moduleId().toString(),
                dto.title(),
                dto.passThresholdPercent(),
                dto.maxAttempts(),
                dto.timeLimitMinutes(),
                dto.questions().stream()
                        .map(q -> new QuestionForAttemptResponse(
                                q.id().toString(),
                                q.questionText(),
                                q.questionType(),
                                q.points(),
                                q.questionOrder(),
                                q.options().stream()
                                        .map(o -> new OptionForAttemptResponse(o.id().toString(), o.optionText(), o.optionOrder()))
                                        .toList()
                        ))
                        .toList()
        );
    }

    private static AttemptResponse toAttemptResponse(AttemptDto dto) {
        return new AttemptResponse(
                dto.attemptId().toString(),
                dto.traineeAssessmentId().toString(),
                dto.attemptNumber(),
                dto.startedAt().toString(),
                toResponse(dto.quiz())
        );
    }

    private static SubmittedAttemptResponse toSubmittedResponse(SubmittedAttemptDto dto) {
        List<SubmittedAnswerResponse> answerResponses = dto.answers() == null ? List.of() :
                dto.answers().stream().map(a -> new SubmittedAnswerResponse(
                        a.questionId() != null ? a.questionId().toString() : null,
                        a.questionText(),
                        a.selectedOptionId() != null ? a.selectedOptionId().toString() : null,
                        a.selectedOptionText(),
                        a.correctOptionId() != null ? a.correctOptionId().toString() : null,
                        a.correctOptionText(),
                        a.correct(),
                        a.pointsAwarded(),
                        a.totalPoints()
                )).toList();
        return new SubmittedAttemptResponse(
                dto.attemptId().toString(),
                dto.pointsEarned(),
                dto.totalPoints(),
                dto.percentScore(),
                dto.passed(),
                dto.completedAt().toString(),
                answerResponses
        );
    }

    public record SubmitAttemptRequest(List<AnswerRequest> answers) {}
    public record AnswerRequest(UUID questionId, UUID selectedOptionId, String textAnswer) {}

    public record QuizForAttemptResponse(String quizId, String moduleId, String title, int passThresholdPercent, Integer maxAttempts, Integer timeLimitMinutes, List<QuestionForAttemptResponse> questions) {}
    public record QuestionForAttemptResponse(String id, String questionText, String questionType, int points, int questionOrder, List<OptionForAttemptResponse> options) {}
    public record OptionForAttemptResponse(String id, String optionText, int optionOrder) {}

    public record AttemptResponse(String attemptId, String traineeAssessmentId, int attemptNumber, String startedAt, QuizForAttemptResponse quiz) {}
    public record SubmittedAttemptResponse(String attemptId, int pointsEarned, int totalPoints, int percentScore, boolean passed, String completedAt, List<SubmittedAnswerResponse> answers) {}
    public record SubmittedAnswerResponse(String questionId, String questionText, String selectedOptionId, String selectedOptionText, String correctOptionId, String correctOptionText, boolean correct, int pointsAwarded, int totalPoints) {}
}
