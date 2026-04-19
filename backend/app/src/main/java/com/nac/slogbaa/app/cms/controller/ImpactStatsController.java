package com.nac.slogbaa.app.cms.controller;

import com.nac.slogbaa.app.cms.dto.ImpactStatsDto;
import com.nac.slogbaa.iam.adapters.persistence.repository.JpaTraineeRepository;
import com.nac.slogbaa.learning.adapters.persistence.repository.JpaCourseRepository;
import com.nac.slogbaa.progress.adapters.persistence.repository.JpaCertificateRepository;
import com.nac.slogbaa.progress.adapters.persistence.repository.JpaCourseReviewRepository;
import com.nac.slogbaa.progress.adapters.persistence.repository.JpaCourseStaffReviewRepository;
import com.nac.slogbaa.progress.adapters.persistence.repository.JpaTraineeProgressRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public/impact")
public class ImpactStatsController {

    private final JpaCourseRepository courseRepo;
    private final JpaCertificateRepository certificateRepo;
    private final JpaTraineeRepository traineeRepo;
    private final JpaTraineeProgressRepository progressRepo;
    private final JpaCourseReviewRepository reviewRepo;
    private final JpaCourseStaffReviewRepository staffReviewRepo;

    public ImpactStatsController(JpaCourseRepository courseRepo,
                                JpaCertificateRepository certificateRepo,
                                JpaTraineeRepository traineeRepo,
                                JpaTraineeProgressRepository progressRepo,
                                JpaCourseReviewRepository reviewRepo,
                                JpaCourseStaffReviewRepository staffReviewRepo) {
        this.courseRepo = courseRepo;
        this.certificateRepo = certificateRepo;
        this.traineeRepo = traineeRepo;
        this.progressRepo = progressRepo;
        this.reviewRepo = reviewRepo;
        this.staffReviewRepo = staffReviewRepo;
    }

    @GetMapping("/stats")
    public ResponseEntity<ImpactStatsDto> getImpactStats() {
        long coursesCount = courseRepo.count();
        long certificatesCount = certificateRepo.count();
        long traineeCount = traineeRepo.count();
        long districtsCount = traineeRepo.countDistinctDistrictName();

        // Count completed courses
        // Note: This matches "COMPLETED" status in TraineeProgressEntity
        long coursesDone = progressRepo.countByStatus("COMPLETED");

        // Demographics
        Map<String, Long> demographicsByGender = listToMap(traineeRepo.countByGender());
        Map<String, Long> demographicsByDistrict = listToMap(traineeRepo.countByDistrict());

        // Reviews
        double avgTraineeRating = reviewRepo.globalAverageRating();
        double avgAdminRating = staffReviewRepo.globalAverageRating();

        return ResponseEntity.ok(new ImpactStatsDto(
            coursesDone,
            certificatesCount,
            traineeCount,
            coursesCount,
            districtsCount,
            demographicsByDistrict,
            demographicsByGender,
            avgTraineeRating,
            avgAdminRating
        ));
    }

    private Map<String, Long> listToMap(List<Object[]> results) {
        Map<String, Long> map = new HashMap<>();
        for (Object[] row : results) {
            String key = row[0] != null ? row[0].toString() : "Unknown";
            Long value = row[1] != null ? (Long) row[1] : 0L;
            map.put(key, value);
        }
        return map;
    }
}
