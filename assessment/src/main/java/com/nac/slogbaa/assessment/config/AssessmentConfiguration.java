package com.nac.slogbaa.assessment.config;

import com.nac.slogbaa.assessment.application.port.in.GetQuizForAttemptUseCase;
import com.nac.slogbaa.assessment.application.port.in.QuizCrudUseCase;
import com.nac.slogbaa.assessment.application.port.in.StartAttemptUseCase;
import com.nac.slogbaa.assessment.application.port.in.SubmitAttemptUseCase;
import com.nac.slogbaa.assessment.application.port.out.AttemptPort;
import com.nac.slogbaa.assessment.application.port.out.QuizStorePort;
import com.nac.slogbaa.assessment.application.service.GetQuizForAttemptService;
import com.nac.slogbaa.assessment.application.service.QuizCrudService;
import com.nac.slogbaa.assessment.application.service.StartAttemptService;
import com.nac.slogbaa.assessment.application.service.SubmitAttemptService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AssessmentConfiguration {

    @Bean
    public GetQuizForAttemptUseCase getQuizForAttemptUseCase(QuizStorePort quizStore, AttemptPort attemptPort) {
        return new GetQuizForAttemptService(quizStore, attemptPort);
    }

    @Bean
    public QuizCrudUseCase quizCrudUseCase(QuizStorePort quizStore) {
        return new QuizCrudService(quizStore);
    }

    @Bean
    public StartAttemptUseCase startAttemptUseCase(AttemptPort attemptPort, QuizStorePort quizStore) {
        return new StartAttemptService(attemptPort, quizStore);
    }

    @Bean
    public SubmitAttemptUseCase submitAttemptUseCase(AttemptPort attemptPort) {
        return new SubmitAttemptService(attemptPort);
    }
}
