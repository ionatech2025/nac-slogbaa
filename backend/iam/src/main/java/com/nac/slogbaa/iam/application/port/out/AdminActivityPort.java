package com.nac.slogbaa.iam.application.port.out;

import java.util.UUID;

public interface AdminActivityPort {
    void logActivity(UUID actorId, String actionType, String targetId, String description);
}
