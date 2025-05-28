package com.se330.ctuong_backend.service;

import com.se330.ctuong_backend.config.ApplicationConfiguration;
import com.se330.ctuong_backend.dto.GameDto;
import com.se330.ctuong_backend.dto.message.Game;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GameCreatedNotifier {
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final BotMessageService botMessageService;

    public void notify(GameDto game) {
        var dto = Game.builder()
                .gameId(game.getId())
                .blackPlayerId(game.getBlackPlayer().getId())
                .whitePlayerId(game.getWhitePlayer().getId())
                .build();

        // Bot moves first, so we send the bot command first
        if (game.isGameWithBot() && game.getWhitePlayer().getId().equals(ApplicationConfiguration.getBotId())) {
            botMessageService.makeBotMove(game.getId());
        }

        // One of these will be redundant if we play with a bot :), but it's fine
        simpMessagingTemplate.convertAndSendToUser(game.getWhitePlayer().getSub(), "/game/join", dto);
        simpMessagingTemplate.convertAndSendToUser(game.getBlackPlayer().getSub(), "/game/join", dto);
    }
}
