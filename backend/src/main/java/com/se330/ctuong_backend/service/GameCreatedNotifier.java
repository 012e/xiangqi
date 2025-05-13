package com.se330.ctuong_backend.service;

import com.se330.ctuong_backend.dto.GameDto;
import com.se330.ctuong_backend.dto.message.Game;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GameCreatedNotifier {
    private final SimpMessagingTemplate simpMessagingTemplate;

    public void notify(GameDto game) {
        var dto = Game.builder()
                .gameId(game.getId())
                .blackPlayerId(game.getBlackPlayer().getId())
                .whitePlayerId(game.getWhitePlayer().getId())
                .build();

        simpMessagingTemplate.convertAndSendToUser(game.getWhitePlayer().getSub(), "/game/join", dto);
        simpMessagingTemplate.convertAndSendToUser(game.getBlackPlayer().getSub(), "/game/join", dto);

    }
}
