package com.se330.ctuong_backend.controller;

import com.auth0.exception.Auth0Exception;
import com.se330.ctuong_backend.dto.message.BoardStateMessage;
import com.se330.ctuong_backend.dto.message.PlayData;
import com.se330.ctuong_backend.dto.message.PlayMessage;
import com.se330.ctuong_backend.model.Game;
import com.se330.ctuong_backend.repository.GameRepository;
import com.se330.ctuong_backend.repository.UserRepository;
import com.se330.ctuong_backend.service.MatchMaker;
import com.se330.ctuong_backend.service.UserService;
import com.se330.xiangqi.Move;
import com.se330.xiangqi.Xiangqi;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    private final SimpMessagingTemplate messagingTemplate;
    private final MatchMaker matchMaker;
    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final UserService userService;

    @MessageMapping("/game/join")
    public void join(Principal principal) throws Auth0Exception {
        if (principal == null) {
            return;
        }
        final var sub = principal.getName();
        var player = userRepository.getUserBySub(sub);
        if (player.isPresent()) {
            matchMaker.addToPlayerPool(player.get().getId());
            return;
        }

        // auth user is not synced
        userService.syncAuthUser(principal);
        final var syncedUser = userRepository.getUserBySub(sub).orElseThrow(() -> new IllegalStateException("user must be synced"));
        matchMaker.addToPlayerPool(syncedUser.getId());
    }

    @MessageMapping("/game/{gameId}")
    @SendTo("/topic/game/{gameId}")
    public BoardStateMessage<?> move(@DestinationVariable String gameId, @Payload Move move, Principal principal) {
        if (principal == null) {
            return null;
        }

        final var sub = principal.getName();
        final var user = userRepository.getUserBySub(sub).orElseThrow(() -> new IllegalStateException("User must exists"));
        final Game game = gameRepository.getGameById(gameId);
        if (game == null) {
            return null;
        }
        final var isWhite = game.getWhitePlayer().getSub().equals(user.getSub());
        final var board = Xiangqi.fromUciFen(game.getUciFen());

        if (!board.isLegalMove(move).isOk()) {
            return null;
        }

        final String userGamePath = "/game/" + gameId;
        if (isWhite) {
            messagingTemplate.convertAndSendToUser(game.getBlackPlayer().getSub(), userGamePath, move);
        } else {
            messagingTemplate.convertAndSendToUser(game.getWhitePlayer().getSub(), userGamePath, move);
        }

        board.move(move);
        game.setUciFen(board.exportUciFen());
        gameRepository.save(game);

        var playData = PlayData.builder()
                .fen(board.exportFen())
                .uciFen(board.exportUciFen())
                .from(move.getFrom())
                .to(move.getTo())
                .player(isWhite ? "white" : "black")
                .build();

        return new PlayMessage(playData);
    }
}
