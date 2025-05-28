package com.se330.ctuong_backend.service;

import com.se330.ctuong_backend.config.QueueConfiguration;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class BotMessageService {
    private final RabbitTemplate rabbitTemplate;

    public void makeBotMove(String gameId) {
        log.info("Sending bot command to queue: {}", gameId);
        
        rabbitTemplate.convertAndSend(
            QueueConfiguration.BOT_EXCHANGE_NAME,
            QueueConfiguration.BOT_ROUTING_KEY,
            gameId
        );
        
        log.info("Bot command sent successfully");
    }
}