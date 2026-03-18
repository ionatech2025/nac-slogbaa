package com.nac.slogbaa.app.cms.repository;

import com.nac.slogbaa.app.cms.entity.HomepageNews;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsRepository extends JpaRepository<HomepageNews, UUID> {
    List<HomepageNews> findByActiveTrueOrderBySortOrderAsc();
}
