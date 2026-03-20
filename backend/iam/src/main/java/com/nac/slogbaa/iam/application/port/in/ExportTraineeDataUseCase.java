package com.nac.slogbaa.iam.application.port.in;

import com.nac.slogbaa.iam.application.dto.result.TraineeDataExportResult;

import java.util.UUID;

/**
 * Use case: export all trainee data for GDPR data portability (Article 20).
 */
public interface ExportTraineeDataUseCase {

    TraineeDataExportResult export(UUID traineeId);
}
