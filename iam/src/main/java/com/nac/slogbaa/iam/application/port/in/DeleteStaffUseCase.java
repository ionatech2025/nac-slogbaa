package com.nac.slogbaa.iam.application.port.in;

import java.util.UUID;

/**
 * Use case: delete a staff user by id. SUPER_ADMIN only.
 * Fails if deleting self or the last Super Admin.
 */
public interface DeleteStaffUseCase {

    /**
     * @param staffIdToDelete id of the staff to delete
     * @param currentUserId   id of the caller (must not match staffIdToDelete)
     */
    void delete(UUID staffIdToDelete, UUID currentUserId);
}
