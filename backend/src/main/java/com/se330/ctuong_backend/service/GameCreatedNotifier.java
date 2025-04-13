package com.se330.ctuong_backend.service;

import com.se330.ctuong_backend.dto.message.Game;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GameCreatedNotifier {
    private final SimpMessagingTemplate simpMessagingTemplate;

    public void notify(com.se330.ctuong_backend.model.Game game) {
        Game dto = Game
                .builder()
                .blackPlayerId(game.getBlackPlayer().getSub())
                .whitePlayerId(game.getWhitePlayer().getSub())
                .gameId(game.getId())
                .build();


        simpMessagingTemplate.convertAndSendToUser(game.getWhitePlayer().getSub(), "/game/join", dto);
        simpMessagingTemplate.convertAndSendToUser(game.getBlackPlayer().getSub(), "/game/join", dto);

    }
}
