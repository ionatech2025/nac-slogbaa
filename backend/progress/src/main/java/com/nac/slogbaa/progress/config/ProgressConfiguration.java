package com.nac.slogbaa.progress.config;

import com.nac.slogbaa.iam.application.port.in.GetStaffByIdUseCase;
import com.nac.slogbaa.iam.application.port.in.GetTraineeByIdUseCase;
import com.nac.slogbaa.learning.application.port.out.CourseDetailsQueryPort;
import com.nac.slogbaa.learning.application.port.out.CoursePublicationPort;
import com.nac.slogbaa.learning.application.port.out.CourseSummaryQueryPort;
import com.nac.slogbaa.shared.ports.CertificatePdfGeneratorPort;
import com.nac.slogbaa.shared.ports.FileStoragePort;
import com.nac.slogbaa.shared.ports.TraineeCourseQuizScorePort;
import com.nac.slogbaa.shared.ports.TraineeNotificationPort;
import com.nac.slogbaa.progress.application.port.in.CheckAndAwardBadgesUseCase;
import com.nac.slogbaa.progress.application.port.in.CreateDiscussionThreadUseCase;
import com.nac.slogbaa.progress.application.port.in.EnrollTraineeUseCase;
import com.nac.slogbaa.progress.application.port.in.GetCourseReviewsUseCase;
import com.nac.slogbaa.progress.application.port.in.GetDiscussionThreadsUseCase;
import com.nac.slogbaa.progress.application.port.in.GetEnrolledCoursesUseCase;
import com.nac.slogbaa.progress.application.port.in.GetBookmarksUseCase;
import com.nac.slogbaa.progress.application.port.in.GetLeaderboardUseCase;
import com.nac.slogbaa.progress.application.port.in.GetTraineeAchievementsUseCase;
import com.nac.slogbaa.progress.application.port.in.ToggleBookmarkUseCase;
import com.nac.slogbaa.progress.application.port.in.GetResumePointUseCase;
import com.nac.slogbaa.progress.application.port.in.GetStreakUseCase;
import com.nac.slogbaa.progress.application.port.in.IssueCertificateUseCase;
import com.nac.slogbaa.progress.application.port.in.ListCertificatesUseCase;
import com.nac.slogbaa.progress.application.port.in.RecordActivityUseCase;
import com.nac.slogbaa.progress.application.port.in.RecordModuleCompletionUseCase;
import com.nac.slogbaa.progress.application.port.in.ReplyToThreadUseCase;
import com.nac.slogbaa.progress.application.port.in.ResolveThreadUseCase;
import com.nac.slogbaa.progress.application.port.in.RevokeCertificateUseCase;
import com.nac.slogbaa.progress.application.port.in.RecordProgressUseCase;
import com.nac.slogbaa.progress.application.port.in.SubmitCourseReviewUseCase;
import com.nac.slogbaa.progress.application.port.in.UpdateDailyGoalUseCase;
import com.nac.slogbaa.progress.application.port.out.CertificateRepositoryPort;
import com.nac.slogbaa.progress.application.port.out.CourseReviewPort;
import com.nac.slogbaa.progress.application.port.out.DiscussionPort;
import com.nac.slogbaa.progress.application.port.out.BadgePort;
import com.nac.slogbaa.progress.application.port.out.BookmarkPort;
import com.nac.slogbaa.progress.application.port.out.ModuleCompletionPort;
import com.nac.slogbaa.progress.application.port.out.StreakPort;
import com.nac.slogbaa.progress.application.port.out.TraineeProgressRepositoryPort;
import com.nac.slogbaa.progress.application.port.out.XpPort;
import com.nac.slogbaa.progress.application.service.CreateDiscussionThreadService;
import com.nac.slogbaa.progress.application.service.EnrollTraineeService;
import com.nac.slogbaa.progress.application.service.GetCourseReviewsService;
import com.nac.slogbaa.progress.application.service.GetDiscussionThreadsService;
import com.nac.slogbaa.progress.application.service.CheckAndAwardBadgesService;
import com.nac.slogbaa.progress.application.service.GetBookmarksService;
import com.nac.slogbaa.progress.application.service.GetLeaderboardService;
import com.nac.slogbaa.progress.application.service.GetTraineeAchievementsService;
import com.nac.slogbaa.progress.application.service.ToggleBookmarkService;
import com.nac.slogbaa.progress.application.service.GetStreakService;
import com.nac.slogbaa.progress.application.service.IssueCertificateService;
import com.nac.slogbaa.progress.application.service.ListCertificatesService;
import com.nac.slogbaa.progress.application.service.RecordActivityService;
import com.nac.slogbaa.progress.application.service.ReplyToThreadService;
import com.nac.slogbaa.progress.application.service.ResolveThreadService;
import com.nac.slogbaa.progress.application.service.RevokeCertificateService;
import com.nac.slogbaa.progress.application.service.GetEnrolledCoursesService;
import com.nac.slogbaa.progress.application.service.GetResumePointService;
import com.nac.slogbaa.progress.application.service.RecordModuleCompletionService;
import com.nac.slogbaa.progress.application.service.RecordProgressService;
import com.nac.slogbaa.progress.application.service.SubmitCourseReviewService;
import com.nac.slogbaa.progress.application.service.UpdateDailyGoalService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ProgressConfiguration {

    @Bean
    public CheckAndAwardBadgesUseCase checkAndAwardBadgesUseCase(
            BadgePort badgePort,
            XpPort xpPort,
            TraineeProgressRepositoryPort traineeProgressRepository,
            StreakPort streakPort) {
        return new CheckAndAwardBadgesService(badgePort, xpPort, traineeProgressRepository, streakPort);
    }

    @Bean
    public EnrollTraineeUseCase enrollTraineeUseCase(
            CoursePublicationPort coursePublicationPort,
            TraineeProgressRepositoryPort traineeProgressRepository,
            CheckAndAwardBadgesUseCase checkAndAwardBadgesUseCase) {
        return new EnrollTraineeService(coursePublicationPort, traineeProgressRepository, checkAndAwardBadgesUseCase);
    }

    @Bean
    public GetEnrolledCoursesUseCase getEnrolledCoursesUseCase(
            TraineeProgressRepositoryPort traineeProgressRepository,
            CourseSummaryQueryPort courseSummaryQueryPort) {
        return new GetEnrolledCoursesService(traineeProgressRepository, courseSummaryQueryPort);
    }

    @Bean
    public RecordModuleCompletionUseCase recordModuleCompletionUseCase(
            TraineeProgressRepositoryPort traineeProgressRepository,
            ModuleCompletionPort moduleCompletionPort,
            CourseDetailsQueryPort courseDetailsQueryPort,
            IssueCertificateUseCase issueCertificateUseCase,
            CheckAndAwardBadgesUseCase checkAndAwardBadgesUseCase) {
        return new RecordModuleCompletionService(traineeProgressRepository, moduleCompletionPort, courseDetailsQueryPort, issueCertificateUseCase, checkAndAwardBadgesUseCase);
    }

    @Bean
    public IssueCertificateUseCase issueCertificateUseCase(
            CertificateRepositoryPort certificateRepository,
            TraineeProgressRepositoryPort traineeProgressRepository,
            CourseDetailsQueryPort courseDetailsQueryPort,
            TraineeCourseQuizScorePort traineeCourseQuizScorePort,
            GetTraineeByIdUseCase getTraineeByIdUseCase,
            CertificatePdfGeneratorPort pdfGenerator,
            FileStoragePort fileStorage,
            com.nac.slogbaa.progress.application.port.out.TraineeSettingsPort traineeSettingsPort,
            TraineeNotificationPort traineeNotificationPort) {
        return new IssueCertificateService(certificateRepository, traineeProgressRepository, courseDetailsQueryPort,
                traineeCourseQuizScorePort, getTraineeByIdUseCase, pdfGenerator, fileStorage, traineeSettingsPort, traineeNotificationPort);
    }

    @Bean
    public RecordActivityUseCase recordActivityUseCase(StreakPort streakPort) {
        return new RecordActivityService(streakPort);
    }

    @Bean
    public GetStreakUseCase getStreakUseCase(StreakPort streakPort,
                                             CheckAndAwardBadgesUseCase checkAndAwardBadgesUseCase) {
        return new GetStreakService(streakPort, checkAndAwardBadgesUseCase);
    }

    @Bean
    public UpdateDailyGoalUseCase updateDailyGoalUseCase(StreakPort streakPort) {
        return new UpdateDailyGoalService(streakPort);
    }

    @Bean
    public RecordProgressUseCase recordProgressUseCase(
            TraineeProgressRepositoryPort traineeProgressRepository,
            CourseDetailsQueryPort courseDetailsQueryPort,
            RecordModuleCompletionUseCase recordModuleCompletionUseCase,
            RecordActivityUseCase recordActivityUseCase) {
        return new RecordProgressService(traineeProgressRepository, courseDetailsQueryPort, recordModuleCompletionUseCase, recordActivityUseCase);
    }

    @Bean
    public GetResumePointUseCase getResumePointUseCase(
            TraineeProgressRepositoryPort traineeProgressRepository) {
        return new GetResumePointService(traineeProgressRepository);
    }

    @Bean
    public ListCertificatesUseCase listCertificatesUseCase(
            CertificateRepositoryPort certificateRepository) {
        return new ListCertificatesService(certificateRepository);
    }

    @Bean
    public RevokeCertificateUseCase revokeCertificateUseCase(
            CertificateRepositoryPort certificateRepository) {
        return new RevokeCertificateService(certificateRepository);
    }

    @Bean
    public GetLeaderboardUseCase getLeaderboardUseCase(
            TraineeProgressRepositoryPort traineeProgressRepository,
            GetTraineeByIdUseCase getTraineeByIdUseCase) {
        return new GetLeaderboardService(traineeProgressRepository, getTraineeByIdUseCase);
    }

    @Bean
    public GetTraineeAchievementsUseCase getTraineeAchievementsUseCase(
            BadgePort badgePort,
            XpPort xpPort) {
        return new GetTraineeAchievementsService(badgePort, xpPort);
    }

    @Bean
    public SubmitCourseReviewUseCase submitCourseReviewUseCase(
            CourseReviewPort courseReviewPort,
            TraineeProgressRepositoryPort traineeProgressRepository,
            CheckAndAwardBadgesUseCase checkAndAwardBadgesUseCase) {
        return new SubmitCourseReviewService(courseReviewPort, traineeProgressRepository, checkAndAwardBadgesUseCase);
    }

    @Bean
    public GetCourseReviewsUseCase getCourseReviewsUseCase(
            CourseReviewPort courseReviewPort,
            GetTraineeByIdUseCase getTraineeByIdUseCase) {
        return new GetCourseReviewsService(courseReviewPort, getTraineeByIdUseCase);
    }

    @Bean
    public CreateDiscussionThreadUseCase createDiscussionThreadUseCase(
            DiscussionPort discussionPort,
            GetTraineeByIdUseCase getTraineeByIdUseCase,
            GetStaffByIdUseCase getStaffByIdUseCase) {
        return new CreateDiscussionThreadService(discussionPort, getTraineeByIdUseCase, getStaffByIdUseCase);
    }

    @Bean
    public ReplyToThreadUseCase replyToThreadUseCase(
            DiscussionPort discussionPort,
            GetTraineeByIdUseCase getTraineeByIdUseCase,
            GetStaffByIdUseCase getStaffByIdUseCase) {
        return new ReplyToThreadService(discussionPort, getTraineeByIdUseCase, getStaffByIdUseCase);
    }

    @Bean
    public GetDiscussionThreadsUseCase getDiscussionThreadsUseCase(
            DiscussionPort discussionPort,
            GetTraineeByIdUseCase getTraineeByIdUseCase,
            GetStaffByIdUseCase getStaffByIdUseCase) {
        return new GetDiscussionThreadsService(discussionPort, getTraineeByIdUseCase, getStaffByIdUseCase);
    }

    @Bean
    public ResolveThreadUseCase resolveThreadUseCase(DiscussionPort discussionPort) {
        return new ResolveThreadService(discussionPort);
    }

    @Bean
    public ToggleBookmarkUseCase toggleBookmarkUseCase(
            BookmarkPort bookmarkPort,
            CourseDetailsQueryPort courseDetailsQueryPort) {
        return new ToggleBookmarkService(bookmarkPort, courseDetailsQueryPort);
    }

    @Bean
    public GetBookmarksUseCase getBookmarksUseCase(
            BookmarkPort bookmarkPort,
            CourseDetailsQueryPort courseDetailsQueryPort) {
        return new GetBookmarksService(bookmarkPort, courseDetailsQueryPort);
    }
}
