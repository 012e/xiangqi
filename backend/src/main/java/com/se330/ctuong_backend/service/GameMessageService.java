package com.se330.ctuong_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GameMessageService {
    private final SimpMessagingTemplate simpMessagingTemplate;

    private String getDestination(String gameId) {
        return "/topic/game/" + gameId;
    }

    public void sendMessageGameTopic(String gameId, Object message) {
        simpMessagingTemplate.convertAndSend(getDestination(gameId), message);
    }
}
