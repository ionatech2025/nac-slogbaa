package com.nac.slogbaa.progress.application.port.out;

import java.util.UUID;

/**
 * Port for trainee settings (e.g. certificate email opt-in).
 */
public interface TraineeSettingsPort {

    boolean isCertificateEmailOptIn(UUID traineeId);

    void setCertificateEmailOptIn(UUID traineeId, boolean optIn);
}
