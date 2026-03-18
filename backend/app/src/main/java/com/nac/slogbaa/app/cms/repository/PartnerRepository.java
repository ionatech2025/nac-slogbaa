package com.nac.slogbaa.app.cms.repository;

import com.nac.slogbaa.app.cms.entity.HomepagePartner;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PartnerRepository extends JpaRepository<HomepagePartner, UUID> {
    List<HomepagePartner> findByActiveTrueOrderBySortOrderAsc();
}
