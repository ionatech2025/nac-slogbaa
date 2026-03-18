package com.nac.slogbaa.app.cms.repository;

import com.nac.slogbaa.app.cms.entity.SiteVisit;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteVisitRepository extends JpaRepository<SiteVisit, UUID> {
}
