package com.nac.slogbaa.app.cms.repository;

import com.nac.slogbaa.app.cms.entity.HomepageVideo;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VideoRepository extends JpaRepository<HomepageVideo, UUID> {
    List<HomepageVideo> findByActiveTrueOrderBySortOrderAsc();
}
