package com.nac.slogbaa.assessment.adapters.persistence.adapter;

import com.nac.slogbaa.assessment.application.dto.OptionDto;
import com.nac.slogbaa.assessment.application.dto.QuestionDto;
import com.nac.slogbaa.assessment.application.dto.QuizDto;
import com.nac.slogbaa.assessment.application.port.out.QuizStorePort;
import com.nac.slogbaa.assessment.adapters.persistence.entity.QuizEntity;
import com.nac.slogbaa.assessment.adapters.persistence.entity.QuestionEntity;
import com.nac.slogbaa.assessment.adapters.persistence.entity.QuizOptionEntity;
import com.nac.slogbaa.assessment.adapters.persistence.repository.JpaQuizRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class QuizStoreAdapter implements QuizStorePort {

    private final JpaQuizRepository quizRepository;

    public QuizStoreAdapter(JpaQuizRepository quizRepository) {
        this.quizRepository = quizRepository;
    }

    @Override
    public QuizDto save(QuizDto dto) {
        QuizEntity entity = quizRepository.findById(dto.id()).orElseGet(QuizEntity::new);
        entity.setId(dto.id() != null ? dto.id() : UUID.randomUUID());
        entity.setModuleId(dto.moduleId());
        entity.setTitle(dto.title());
        entity.setPassThresholdPercent(Math.max(0, Math.min(100, dto.passThresholdPercent())));
        entity.setMaxAttempts(dto.maxAttempts());
        entity.setTimeLimitMinutes(dto.timeLimitMinutes());

        entity.getQuestions().clear();
        for (QuestionDto q : dto.questions()) {
            QuestionEntity qe = new QuestionEntity();
            qe.setId(q.id() != null ? q.id() : UUID.randomUUID());
            qe.setQuiz(entity);
            qe.setQuestionText(q.questionText());
            qe.setQuestionType(q.questionType());
            qe.setPoints(Math.max(0, q.points()));
            qe.setQuestionOrder(q.questionOrder());
            for (OptionDto o : q.options()) {
                QuizOptionEntity oe = new QuizOptionEntity();
                oe.setId(o.id() != null ? o.id() : UUID.randomUUID());
                oe.setQuestion(qe);
                oe.setOptionText(o.optionText());
                oe.setCorrect(o.correct());
                oe.setOptionOrder(o.optionOrder());
                qe.getOptions().add(oe);
            }
            entity.getQuestions().add(qe);
        }
        entity = quizRepository.save(entity);
        return toDto(entity);
    }

    @Override
    public Optional<QuizDto> findById(UUID quizId) {
        return quizRepository.findById(quizId).map(this::toDto);
    }

    @Override
    public Optional<QuizDto> findByModuleId(UUID moduleId) {
        return quizRepository.findByModuleId(moduleId).map(this::toDto);
    }

    @Override
    public void deleteById(UUID quizId) {
        quizRepository.deleteById(quizId);
    }

    @Override
    public boolean existsByModuleId(UUID moduleId) {
        return quizRepository.existsByModuleId(moduleId);
    }

    private QuizDto toDto(QuizEntity e) {
        return new QuizDto(
                e.getId(),
                e.getModuleId(),
                e.getTitle(),
                e.getPassThresholdPercent(),
                e.getMaxAttempts(),
                e.getTimeLimitMinutes(),
                e.getQuestions().stream()
                        .map(this::toQuestionDto)
                        .collect(Collectors.toList())
        );
    }

    private QuestionDto toQuestionDto(QuestionEntity q) {
        return new QuestionDto(
                q.getId(),
                q.getQuiz().getId(),
                q.getQuestionText(),
                q.getQuestionType(),
                q.getPoints(),
                q.getQuestionOrder(),
                q.getOptions().stream()
                        .map(o -> new OptionDto(o.getId(), q.getId(), o.getOptionText(), o.isCorrect(), o.getOptionOrder()))
                        .collect(Collectors.toList())
        );
    }
}
