package com.nac.slogbaa.progress.application.port.in;

import java.util.UUID;

/**
 * Use case: mark a discussion thread as resolved.
 * Only the original thread author or ADMIN/SUPER_ADMIN may resolve.
 */
public interface ResolveThreadUseCase {

    /**
     * Mark thread as resolved.
     *
     * @param threadId the thread to resolve
     * @param requesterId the user requesting resolution
     * @param isStaff whether the requester has ADMIN or SUPER_ADMIN role
     */
    void resolve(UUID threadId, UUID requesterId, boolean isStaff);
}
