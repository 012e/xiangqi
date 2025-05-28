package com.se330.ctuong_backend.queue.bot;

import com.se330.ctuong_backend.config.QueueConfiguration;
import com.se330.ctuong_backend.service.engine.EngineService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class BotQueueHandler {
    private final EngineService engineService;

    @RabbitListener(queues = QueueConfiguration.BOT_QUEUE_NAME)
    public void handleBotMessage(String gameId) {
        log.info("Received bot message: {}", gameId);

        try {
            engineService.move(gameId);
        } catch (Exception e) {
            log.error("Error processing bot message: {}", gameId, e);
            // Handle error - could send to dead letter queue, retry, etc.
        }
    }
}
