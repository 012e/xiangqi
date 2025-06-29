package com.se330.ctuong_backend.service;

import com.se330.ctuong_backend.job.GameEndTimerJob;
import lombok.RequiredArgsConstructor;
import org.quartz.*;
import org.quartz.impl.matchers.GroupMatcher;
import org.quartz.impl.matchers.KeyMatcher;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class GameTimeoutService {
    private final Scheduler scheduler;
    private static final String JOB_KEY = "game-timer-job-key";
    private static final String TRIGGER_KEY = "game-trigger-key";


    public String getJobKey(String gameId) {
        return JOB_KEY + gameId;
    }

    public String getTriggerKey(String gameId) {
        return TRIGGER_KEY + gameId;
    }

    public void addTimeoutTimer(String gameId, Duration duration) throws SchedulerException {
        var job = JobBuilder.newJob(GameEndTimerJob.class)
                .withIdentity(getJobKey(gameId))
                .usingJobData("gameId", gameId)
                .storeDurably()
                .build();

        var trigger = createTriggerWithin(gameId, duration);

        scheduler.scheduleJob(job, trigger);
    }

    private SimpleTrigger createTriggerWithin(String gameId, Duration duration) {
        var endTime = Instant.now()
                .plus(duration);

        return TriggerBuilder.newTrigger()
                .withIdentity(getTriggerKey(gameId))
                .startAt(Date.from(endTime)) // fire after delay
                .forJob(getJobKey(gameId))
                .withSchedule(SimpleScheduleBuilder.simpleSchedule()
                        .withRepeatCount(0))
                .build();
    }

    public void removeTimerIfExists(String gameId) throws SchedulerException {
        final var triggerKey = new TriggerKey(getTriggerKey(gameId));
        if (!scheduler.checkExists(triggerKey)) {
            return;
        }

        scheduler.unscheduleJob(triggerKey);
    }

    public void replaceTimerOrCreateNew(String gameId, Duration duration) throws SchedulerException {
        final var triggerKey = new TriggerKey(getTriggerKey(gameId));
        if (!scheduler.checkExists(triggerKey)) {
            addTimeoutTimer(gameId, duration);
            return;
        }
        final var trigger = createTriggerWithin(gameId, duration);

        scheduler.rescheduleJob(triggerKey, trigger);
    }

    public void compensateLoss(String gameId, Duration lostTime) throws SchedulerException {
        final var triggerKey = new TriggerKey(getTriggerKey(gameId));
        if (!scheduler.checkExists(triggerKey)) {
            return;
        }
        final var trigger = scheduler.getTrigger(triggerKey);
        final var nextFireTime = trigger.getNextFireTime();

        final var newTrigger = createTriggerWithin(gameId,
                Duration.between(Instant.now(), nextFireTime.toInstant()).plus(lostTime));

        scheduler.rescheduleJob(triggerKey, newTrigger);
    }

    public Duration getNextTimeout(String gameId) throws SchedulerException {
        final var triggerKey = new TriggerKey(getTriggerKey(gameId));
        if (!scheduler.checkExists(triggerKey)) {
            return Duration.ZERO;
        }
        final var trigger = scheduler.getTrigger(triggerKey);
        final var nextFireTime = trigger.getNextFireTime();
        if (nextFireTime == null) {
            return Duration.ZERO;
        }

        return Duration.between(nextFireTime.toInstant(), Instant.now()).abs();
    }
}
