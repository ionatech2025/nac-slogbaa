package com.nac.slogbaa.assessment.application.port.in;

import com.nac.slogbaa.assessment.application.dto.SubmittedAttemptDto;
import com.nac.slogbaa.assessment.application.port.out.AttemptPort;

import java.util.List;
import java.util.UUID;

public interface SubmitAttemptUseCase {

    /**
     * Submit answers for an attempt. Persists answers, computes score, pass/fail by threshold.
     */
    SubmittedAttemptDto submit(UUID attemptId, UUID traineeId, List<AttemptPort.AnswerSubmission> answers);
}
