package com.nac.slogbaa.progress.application.port.in;

import java.util.UUID;

/**
 * Use case: create an in-app notification for a trainee or staff user.
 */
public interface CreateNotificationUseCase {

    void createForTrainee(UUID traineeId, String type, String title, String message, String link);

    void createForStaff(UUID staffUserId, String type, String title, String message, String link);
}
