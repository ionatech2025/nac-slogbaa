package com.nac.slogbaa.progress.adapters.persistence.adapter;

import com.nac.slogbaa.progress.adapters.persistence.entity.DailyActivityEntity;
import com.nac.slogbaa.progress.adapters.persistence.entity.TraineeStreakEntity;
import com.nac.slogbaa.progress.adapters.persistence.repository.JpaDailyActivityRepository;
import com.nac.slogbaa.progress.adapters.persistence.repository.JpaTraineeStreakRepository;
import com.nac.slogbaa.progress.application.port.out.StreakPort;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.UUID;

@Component
public class StreakAdapter implements StreakPort {

    private final JpaDailyActivityRepository dailyActivityRepo;
    private final JpaTraineeStreakRepository streakRepo;

    public StreakAdapter(JpaDailyActivityRepository dailyActivityRepo,
                         JpaTraineeStreakRepository streakRepo) {
        this.dailyActivityRepo = dailyActivityRepo;
        this.streakRepo = streakRepo;
    }

    @Override
    public void recordActivity(UUID traineeId, LocalDate date, int minutes) {
        DailyActivityEntity entity = dailyActivityRepo.findByTraineeIdAndActivityDate(traineeId, date)
                .orElseGet(() -> {
                    DailyActivityEntity e = new DailyActivityEntity();
                    e.setTraineeId(traineeId);
                    e.setActivityDate(date);
                    return e;
                });
        entity.setMinutesSpent(entity.getMinutesSpent() + minutes);
        dailyActivityRepo.save(entity);
    }

    @Override
    public StreakData getStreak(UUID traineeId) {
        return streakRepo.findByTraineeId(traineeId)
                .map(e -> new StreakData(e.getCurrentStreak(), e.getLongestStreak(), e.getLastActiveDate(), e.getDailyGoalMinutes()))
                .orElse(new StreakData(0, 0, null, 5));
    }

    @Override
    public int getDailyActivityMinutes(UUID traineeId, LocalDate date) {
        return dailyActivityRepo.findByTraineeIdAndActivityDate(traineeId, date)
                .map(DailyActivityEntity::getMinutesSpent)
                .orElse(0);
    }

    @Override
    public void updateDailyGoal(UUID traineeId, int minutes) {
        TraineeStreakEntity entity = streakRepo.findByTraineeId(traineeId)
                .orElseGet(() -> {
                    TraineeStreakEntity e = new TraineeStreakEntity();
                    e.setTraineeId(traineeId);
                    return e;
                });
        entity.setDailyGoalMinutes(minutes);
        streakRepo.save(entity);
    }

    @Override
    public void updateStreak(UUID traineeId, int currentStreak, int longestStreak, LocalDate lastActiveDate) {
        TraineeStreakEntity entity = streakRepo.findByTraineeId(traineeId)
                .orElseGet(() -> {
                    TraineeStreakEntity e = new TraineeStreakEntity();
                    e.setTraineeId(traineeId);
                    return e;
                });
        entity.setCurrentStreak(currentStreak);
        entity.setLongestStreak(longestStreak);
        entity.setLastActiveDate(lastActiveDate);
        streakRepo.save(entity);
    }
}
