package com.se330.ctuong_backend.job;

import com.se330.ctuong_backend.service.game.GameService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.*;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class GameEndTimerJob implements InterruptableJob {
    private final GameService gameService;

    @Override
    @Transactional
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        String gameId = jobExecutionContext.getJobDetail().getJobDataMap().getString("gameId");
        try {
            final var game = gameService.getGameById(gameId)
                    .orElseThrow(() -> new IllegalStateException("Game not found with id: " + gameId));
            if (game.getIsEnded()) {
                return;
            }
        } catch (SchedulerException e) {
            throw new IllegalStateException(e);
        }

        try {
            gameService.markTimeout(gameId);
        } catch (SchedulerException e) {
            throw new RuntimeException(e);
        }
        log.info("Game {} ended by timeout", gameId);
    }

    @Override
    public void interrupt() throws UnableToInterruptJobException {
    }
}
