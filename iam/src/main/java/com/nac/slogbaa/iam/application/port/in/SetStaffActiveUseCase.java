package com.nac.slogbaa.iam.application.port.in;

import java.util.UUID;

/**
 * Use case: SuperAdmin activates or deactivates a staff user.
 */
public interface SetStaffActiveUseCase {

    void setActive(UUID staffId, boolean active);
}
