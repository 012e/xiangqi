package com.se330.ctuong_backend.controller;

import com.auth0.exception.Auth0Exception;
import com.se330.ctuong_backend.dto.message.CreateGameMessage;
import com.se330.ctuong_backend.repository.UserRepository;
import com.se330.ctuong_backend.service.game.GameService;
import com.se330.ctuong_backend.service.MatchMaker;
import com.se330.ctuong_backend.service.UserService;
import com.se330.xiangqi.Move;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.SchedulerException;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
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

    @MessageMapping("/game/join")
    public void join(Principal principal, @Payload CreateGameMessage createGameMessage) throws Auth0Exception {
        if (principal == null) {
            return;
        }

        final var sub = principal.getName();
        var player = userRepository.getUserBySub(sub);
        if (player.isPresent()) {
            matchMaker.addToPool(player.get().getId(), createGameMessage);
            return;
        }

        // auth user is not synced
        userService.syncAuthUser(principal);
        final var syncedUser = userRepository
                .getUserBySub(sub)
                .orElseThrow(() -> new IllegalStateException("user must be synced"));

        matchMaker.addToPool(syncedUser.getId(), createGameMessage);
    }

    @MessageMapping("/game/{gameId}")
    @SendTo("/topic/game/{gameId}")
    public void move(@DestinationVariable String gameId, @Payload Move move, Principal principal) throws SchedulerException {
        if (principal == null) {
            return;
        }

        final var sub = principal.getName();
        userRepository
                .getUserBySub(sub)
                .orElseThrow(() -> new IllegalStateException("User must exists"));

        final var gameDtoOptional = gameService.getGameById(gameId);
        if (gameDtoOptional.isEmpty()) {
            return;
        }
        final var game = gameDtoOptional.get();

        gameService.handleHumanMove(game.getId(), move);
    }
}
