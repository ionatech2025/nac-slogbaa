package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.progress.application.dto.EngagementAnalyticsResponse;
import com.nac.slogbaa.progress.application.dto.EngagementAnalyticsResponse.DailyEngagementDto;
import com.nac.slogbaa.progress.application.dto.EngagementAnalyticsResponse.RatingBucketDto;
import com.nac.slogbaa.progress.application.port.in.GetEngagementAnalyticsUseCase;
import com.nac.slogbaa.progress.application.port.out.CourseReviewPort;
import com.nac.slogbaa.progress.application.port.out.CourseStaffReviewPort;
import com.nac.slogbaa.progress.application.port.out.DiscussionPort;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Date;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

public final class EngagementAnalyticsService implements GetEngagementAnalyticsUseCase {

    private final CourseReviewPort courseReviewPort;
    private final CourseStaffReviewPort courseStaffReviewPort;
    private final DiscussionPort discussionPort;

    public EngagementAnalyticsService(CourseReviewPort courseReviewPort,
                                      CourseStaffReviewPort courseStaffReviewPort,
                                      DiscussionPort discussionPort) {
        this.courseReviewPort = courseReviewPort;
        this.courseStaffReviewPort = courseStaffReviewPort;
        this.discussionPort = discussionPort;
    }

    @Override
    public EngagementAnalyticsResponse get(boolean includeDiscussionMetrics) {
        long traineeReviewCount = courseReviewPort.countAll();
        long staffReviewCount = courseStaffReviewPort.countAll();
        long totalReviewCount = traineeReviewCount + staffReviewCount;

        double combinedAverageRating = 0;
        if (totalReviewCount > 0) {
            double sumTrainee = sumRatings(courseReviewPort.countGroupedByRating());
            double sumStaff = sumRatings(courseStaffReviewPort.countGroupedByRating());
            combinedAverageRating = BigDecimal.valueOf((sumTrainee + sumStaff) / totalReviewCount)
                    .setScale(2, RoundingMode.HALF_UP)
                    .doubleValue();
        }

        Map<Integer, Long> hist = new HashMap<>();
        mergeHistogram(hist, courseReviewPort.countGroupedByRating());
        mergeHistogram(hist, courseStaffReviewPort.countGroupedByRating());
        List<RatingBucketDto> ratingDistribution = new ArrayList<>();
        for (int s = 1; s <= 5; s++) {
            ratingDistribution.add(new RatingBucketDto(s, hist.getOrDefault(s, 0L)));
        }

        Instant since = LocalDate.now(ZoneOffset.UTC).minusDays(6).atStartOfDay(ZoneOffset.UTC).toInstant();
        Map<String, Long> reviewsByDay = mergeDayCounts(
                courseReviewPort.countCreatedPerUtcDaySince(since),
                courseStaffReviewPort.countCreatedPerUtcDaySince(since)
        );

        Map<String, Long> questionsByDay = Map.of();
        Map<String, Long> repliesByDay = Map.of();
        Long traineeQuestionCount = null;
        Long totalDiscussionReplies = null;
        if (includeDiscussionMetrics) {
            traineeQuestionCount = discussionPort.countThreadsByAuthorType("TRAINEE");
            totalDiscussionReplies = discussionPort.countAllReplies();
            questionsByDay = toDayMap(discussionPort.countTraineeThreadsPerUtcDaySince(since));
            repliesByDay = toDayMap(discussionPort.countDiscussionRepliesPerUtcDaySince(since));
        }

        List<DailyEngagementDto> lastSevenDays = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate d = LocalDate.now(ZoneOffset.UTC).minusDays(i);
            String key = d.toString();
            String label = d.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.UK) + " " + d.getDayOfMonth();
            long rev = reviewsByDay.getOrDefault(key, 0L);
            long q = includeDiscussionMetrics ? questionsByDay.getOrDefault(key, 0L) : 0L;
            long r = includeDiscussionMetrics ? repliesByDay.getOrDefault(key, 0L) : 0L;
            lastSevenDays.add(new DailyEngagementDto(key, label, rev, q, r));
        }

        return new EngagementAnalyticsResponse(
                traineeReviewCount,
                staffReviewCount,
                totalReviewCount,
                combinedAverageRating,
                ratingDistribution,
                lastSevenDays,
                traineeQuestionCount,
                totalDiscussionReplies
        );
    }

    private static double sumRatings(List<Object[]> rows) {
        double sum = 0;
        for (Object[] row : rows) {
            short rating = ((Number) row[0]).shortValue();
            long c = ((Number) row[1]).longValue();
            sum += rating * c;
        }
        return sum;
    }

    private static void mergeHistogram(Map<Integer, Long> target, List<Object[]> rows) {
        for (Object[] row : rows) {
            int stars = ((Number) row[0]).intValue();
            long c = ((Number) row[1]).longValue();
            target.merge(stars, c, Long::sum);
        }
    }

    private static Map<String, Long> mergeDayCounts(List<Object[]> a, List<Object[]> b) {
        Map<String, Long> m = new HashMap<>();
        addDayRows(m, a);
        addDayRows(m, b);
        return m;
    }

    private static void addDayRows(Map<String, Long> m, List<Object[]> rows) {
        for (Object[] row : rows) {
            String key = row[0] instanceof Date d ? d.toLocalDate().toString() : row[0].toString();
            long c = ((Number) row[1]).longValue();
            m.merge(key, c, Long::sum);
        }
    }

    private static Map<String, Long> toDayMap(List<Object[]> rows) {
        Map<String, Long> m = new HashMap<>();
        addDayRows(m, rows);
        return m;
    }
}
