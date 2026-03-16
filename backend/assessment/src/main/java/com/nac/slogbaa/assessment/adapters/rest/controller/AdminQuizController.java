package com.nac.slogbaa.assessment.adapters.rest.controller;

import com.nac.slogbaa.assessment.application.dto.OptionDto;
import com.nac.slogbaa.assessment.application.dto.QuestionDto;
import com.nac.slogbaa.assessment.application.dto.QuizDto;
import com.nac.slogbaa.assessment.application.port.in.QuizCrudUseCase;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Admin CRUD for quiz (with questions and options) per module.
 */
@RestController
@RequestMapping("/api/admin/assessment/modules/{moduleId}/quiz")
@PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
public class AdminQuizController {

    private final QuizCrudUseCase quizCrudUseCase;

    public AdminQuizController(QuizCrudUseCase quizCrudUseCase) {
        this.quizCrudUseCase = quizCrudUseCase;
    }

    @GetMapping
    public ResponseEntity<QuizResponse> getByModule(@PathVariable UUID moduleId) {
        return quizCrudUseCase.getByModuleId(moduleId)
                .map(AdminQuizController::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping
    public ResponseEntity<QuizResponse> createOrUpdate(
            @PathVariable UUID moduleId,
            @RequestBody QuizRequest request) {
        var existing = quizCrudUseCase.getByModuleId(moduleId);
        QuizDto dto = toDto(moduleId, request);
        if (existing.isPresent()) {
            dto = new QuizDto(existing.get().id(), dto.moduleId(), dto.title(), dto.passThresholdPercent(), dto.maxAttempts(), dto.timeLimitMinutes(), dto.questions());
        }
        try {
            QuizDto saved = existing.isEmpty()
                    ? quizCrudUseCase.create(dto)
                    : quizCrudUseCase.update(dto);
            return ResponseEntity.ok(toResponse(saved));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @DeleteMapping
    public ResponseEntity<Void> delete(@PathVariable UUID moduleId) {
        Optional<QuizDto> quiz = quizCrudUseCase.getByModuleId(moduleId);
        if (quiz.isEmpty()) return ResponseEntity.notFound().build();
        quizCrudUseCase.delete(quiz.get().id());
        return ResponseEntity.noContent().build();
    }

    private static QuizDto toDto(UUID moduleId, QuizRequest req) {
        List<QuestionDto> questions = req.questions() == null ? List.of() : req.questions().stream()
                .map(q -> new QuestionDto(
                        q.id(),
                        null,
                        q.questionText(),
                        q.questionType() != null ? q.questionType() : "MULTIPLE_CHOICE",
                        q.points() != null ? q.points() : 1,
                        q.questionOrder() != null ? q.questionOrder() : 0,
                        q.options() == null ? List.of() : q.options().stream()
                                .map(o -> new OptionDto(o.id(), q.id() != null ? q.id() : UUID.randomUUID(), o.optionText(), Boolean.TRUE.equals(o.correct()), o.optionOrder() != null ? o.optionOrder() : 0))
                                .toList()
                ))
                .toList();
        return new QuizDto(
                req.id(),
                moduleId,
                req.title() != null ? req.title() : "Quiz",
                req.passThresholdPercent() != null ? Math.max(0, Math.min(100, req.passThresholdPercent())) : 70,
                req.maxAttempts(),
                req.timeLimitMinutes(),
                questions
        );
    }

    private static QuizResponse toResponse(QuizDto dto) {
        return new QuizResponse(
                dto.id().toString(),
                dto.moduleId().toString(),
                dto.title(),
                dto.passThresholdPercent(),
                dto.maxAttempts(),
                dto.timeLimitMinutes(),
                dto.questions().stream()
                        .map(q -> new QuestionResponse(
                                q.id().toString(),
                                q.quizId().toString(),
                                q.questionText(),
                                q.questionType(),
                                q.points(),
                                q.questionOrder(),
                                q.options().stream()
                                        .map(o -> new OptionResponse(o.id().toString(), o.questionId().toString(), o.optionText(), o.correct(), o.optionOrder()))
                                        .toList()
                        ))
                        .toList()
        );
    }

    public record QuizRequest(
            UUID id,
            String title,
            Integer passThresholdPercent,
            Integer maxAttempts,
            Integer timeLimitMinutes,
            List<QuestionRequest> questions
    ) {}

    public record QuestionRequest(
            UUID id,
            String questionText,
            String questionType,
            Integer points,
            Integer questionOrder,
            List<OptionRequest> options
    ) {}

    public record OptionRequest(UUID id, String optionText, Boolean correct, Integer optionOrder) {}

    public record QuizResponse(String id, String moduleId, String title, int passThresholdPercent, Integer maxAttempts, Integer timeLimitMinutes, List<QuestionResponse> questions) {}

    public record QuestionResponse(String id, String quizId, String questionText, String questionType, int points, int questionOrder, List<OptionResponse> options) {}

    public record OptionResponse(String id, String questionId, String optionText, boolean correct, int optionOrder) {}
}
