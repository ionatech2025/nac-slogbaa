package com.nac.slogbaa.app.cms.repository;

import com.nac.slogbaa.app.cms.entity.HomepageBanner;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BannerRepository extends JpaRepository<HomepageBanner, UUID> {
    List<HomepageBanner> findByActiveTrueOrderBySortOrderAsc();
}
