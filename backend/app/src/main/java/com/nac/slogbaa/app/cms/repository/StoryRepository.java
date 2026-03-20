package com.nac.slogbaa.app.cms.repository;

import com.nac.slogbaa.app.cms.entity.HomepageStory;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoryRepository extends JpaRepository<HomepageStory, UUID> {
    List<HomepageStory> findByActiveTrueOrderBySortOrderAsc();
}
