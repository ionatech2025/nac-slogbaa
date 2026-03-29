package com.nac.slogbaa.progress.adapters.persistence.adapter;

import com.nac.slogbaa.progress.adapters.persistence.entity.CourseStaffReviewEntity;
import com.nac.slogbaa.progress.adapters.persistence.repository.JpaCourseStaffReviewRepository;
import com.nac.slogbaa.progress.application.port.out.CourseStaffReviewPort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class CourseStaffReviewAdapter implements CourseStaffReviewPort {

    private final JpaCourseStaffReviewRepository jpaRepository;

    public CourseStaffReviewAdapter(JpaCourseStaffReviewRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public CourseStaffReviewEntity save(CourseStaffReviewEntity entity) {
        return jpaRepository.save(entity);
    }

    @Override
    public List<CourseStaffReviewEntity> findByCourseId(UUID courseId) {
        return jpaRepository.findByCourseIdOrderByCreatedAtDesc(courseId);
    }

    @Override
    public Optional<CourseStaffReviewEntity> findByStaffUserAndCourse(UUID staffUserId, UUID courseId) {
        return jpaRepository.findByStaffUserIdAndCourseId(staffUserId, courseId);
    }

    @Override
    public void delete(CourseStaffReviewEntity entity) {
        jpaRepository.delete(entity);
    }

    @Override
    public double getAverageRating(UUID courseId) {
        return jpaRepository.averageRatingForCourse(courseId);
    }

    @Override
    public long getReviewCount(UUID courseId) {
        return jpaRepository.countByCourseId(courseId);
    }

    @Override
    public List<Object[]> countGroupedByRating() {
        return jpaRepository.countGroupedByRating();
    }

    @Override
    public List<Object[]> countCreatedPerUtcDaySince(java.time.Instant since) {
        return jpaRepository.countCreatedPerUtcDaySince(since);
    }

    @Override
    public long countAll() {
        return jpaRepository.count();
    }
}
