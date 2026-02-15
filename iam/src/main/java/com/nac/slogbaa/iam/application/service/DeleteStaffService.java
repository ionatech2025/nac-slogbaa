package com.nac.slogbaa.iam.application.service;

import com.nac.slogbaa.iam.application.port.in.DeleteStaffUseCase;
import com.nac.slogbaa.iam.application.port.out.StaffUserRepositoryPort;
import com.nac.slogbaa.iam.core.aggregate.StaffUser;
import com.nac.slogbaa.iam.core.exception.CannotDeleteLastSuperAdminException;
import com.nac.slogbaa.iam.core.exception.CannotDeleteSelfException;
import com.nac.slogbaa.iam.core.exception.StaffNotFoundException;
import com.nac.slogbaa.iam.core.valueobject.StaffRole;
import com.nac.slogbaa.iam.core.valueobject.StaffUserId;

import java.util.Objects;
import java.util.UUID;

/**
 * Application service: delete a staff user. Prevents deleting self or the last Super Admin.
 */
public final class DeleteStaffService implements DeleteStaffUseCase {

    private final StaffUserRepositoryPort staffUserRepository;

    public DeleteStaffService(StaffUserRepositoryPort staffUserRepository) {
        this.staffUserRepository = staffUserRepository;
    }

    @Override
    public void delete(UUID staffIdToDelete, UUID currentUserId) {
        if (Objects.equals(staffIdToDelete, currentUserId)) {
            throw new CannotDeleteSelfException();
        }
        StaffUserId id = StaffUserId.of(staffIdToDelete);
        StaffUser staff = staffUserRepository.findById(id)
                .orElseThrow(() -> new StaffNotFoundException("Staff not found: " + staffIdToDelete));
        if (staff.getStaffRole() == StaffRole.SUPER_ADMIN) {
            long count = staffUserRepository.countByRole(StaffRole.SUPER_ADMIN);
            if (count <= 1) {
                throw new CannotDeleteLastSuperAdminException();
            }
        }
        staffUserRepository.deleteById(id);
    }
}
