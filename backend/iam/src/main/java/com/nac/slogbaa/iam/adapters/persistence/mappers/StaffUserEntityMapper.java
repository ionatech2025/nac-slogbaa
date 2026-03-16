package com.nac.slogbaa.iam.adapters.persistence.mappers;

import com.nac.slogbaa.iam.adapters.persistence.entity.StaffUserEntity;
import com.nac.slogbaa.iam.core.aggregate.StaffUser;
import com.nac.slogbaa.iam.core.valueobject.Email;
import com.nac.slogbaa.iam.core.valueobject.StaffRole;
import com.nac.slogbaa.iam.core.valueobject.StaffUserId;
import org.springframework.stereotype.Component;

@Component
public class StaffUserEntityMapper {

    public StaffUser toDomain(StaffUserEntity e) {
        if (e == null) return null;
        return new StaffUser(
                new StaffUserId(e.getId()),
                new Email(e.getEmail()),
                e.getPasswordHash(),
                e.getFullName(),
                StaffRole.valueOf(e.getStaffRole().name()),
                e.isActive()
        );
    }

    public StaffUserEntity toEntity(StaffUser u) {
        if (u == null) return null;
        StaffUserEntity e = new StaffUserEntity();
        e.setId(u.getId().getValue());
        e.setEmail(u.getEmail().getValue());
        e.setPasswordHash(u.getPasswordHash());
        e.setFullName(u.getFullName());
        e.setStaffRole(StaffUserEntity.StaffRoleEnum.valueOf(u.getStaffRole().name()));
        e.setActive(u.isActive());
        return e;
    }
}
