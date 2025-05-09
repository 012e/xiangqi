package com.se330.ctuong_backend.service;

import com.se330.ctuong_backend.job.GameEndTimerJob;
import lombok.RequiredArgsConstructor;
import org.quartz.*;
import org.quartz.impl.matchers.GroupMatcher;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class GameTimeoutService {
    private final Scheduler scheduler;
    private static final String JOB_KEY = "gamer-timer-job-key";
    private static final String TRIGGER_KEY = "gamer-trigger-key";


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

        var trigger = TriggerBuilder.newTrigger()
                .withIdentity(getTriggerKey(gameId))
                .startAt(Date.from(Instant.now().plus(duration))) // fire after delay
                .withSchedule(SimpleScheduleBuilder.simpleSchedule()
                        .withRepeatCount(0))
                .build();

        scheduler.scheduleJob(job, trigger);
    }

    public void removeTimerIfExists(String gameId) throws SchedulerException {
        var triggerKeys = scheduler.getTriggerKeys(GroupMatcher.groupEquals(getTriggerKey(gameId)));
        if (triggerKeys.isEmpty()) {
            return; // no trigger found, nothing to remove
        }
        assert triggerKeys.size() == 1; // there should be only one trigger for each gameId
        var triggerKey = triggerKeys.stream().findFirst();

        scheduler.unscheduleJob(triggerKey.get());
    }
}
