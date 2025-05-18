package com.se330.ctuong_backend.controller;

import com.auth0.exception.Auth0Exception;
import com.se330.ctuong_backend.dto.message.Game;
import com.se330.ctuong_backend.dto.message.game.state.BoardStateMessage;
import com.se330.ctuong_backend.dto.message.game.state.GameEndMessage;
import com.se330.ctuong_backend.dto.message.game.state.PlayMessage;
import com.se330.ctuong_backend.repository.UserRepository;
import com.se330.ctuong_backend.service.GameTimeoutService;
import com.se330.ctuong_backend.service.GameService;
import com.se330.ctuong_backend.service.MatchMaker;
import com.se330.ctuong_backend.service.UserService;
import com.se330.xiangqi.Move;
import com.se330.xiangqi.Xiangqi;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.SchedulerException;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
@Slf4j
public class GameMovesController {
    private final MatchMaker matchMaker;
    private final UserRepository userRepository;
    private final GameService gameService;
    private final UserService userService;
    private final GameTimeoutService gameEndTimerService;

    @MessageMapping("/game/join")
    public void join(Principal principal, @Payload Game.CreateGameMessage createGameMessage) throws Auth0Exception {
        if (principal == null) {
            return;
        }

        final var sub = principal.getName();
        var player = userRepository.getUserBySub(sub);
        if (player.isPresent()) {
            matchMaker.addToPlayerPool(player.get().getId(), createGameMessage);
            return;
        }

        // auth user is not synced
        userService.syncAuthUser(principal);
        final var syncedUser = userRepository
                .getUserBySub(sub)
                .orElseThrow(() -> new IllegalStateException("user must be synced"));

        matchMaker.addToPlayerPool(syncedUser.getId(), createGameMessage);
    }

    @MessageMapping("/game/{gameId}")
    @SendTo("/topic/game/{gameId}")
    public BoardStateMessage<?> move(@DestinationVariable String gameId, @Payload Move move, Principal principal) throws SchedulerException {
        if (principal == null) {
            return null;
        }

        final var sub = principal.getName();
        userRepository
                .getUserBySub(sub)
                .orElseThrow(() -> new IllegalStateException("User must exists"));

        final var gameDtoOptional = gameService.getGameById(gameId);
        if (gameDtoOptional.isEmpty()) {
            return null;
        }
        final var game = gameDtoOptional.get();

        final var playData = gameService.moveIfValid(game.getId(), move);

        return new PlayMessage(playData);
    }
}
