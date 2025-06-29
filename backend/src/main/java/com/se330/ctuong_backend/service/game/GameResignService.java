package com.se330.ctuong_backend.service.game;

import com.se330.ctuong_backend.dto.message.game.state.GameEndData;
import com.se330.ctuong_backend.dto.message.game.state.GameEndMessage;
import com.se330.ctuong_backend.dto.message.game.state.GameResult;
import com.se330.ctuong_backend.repository.GameRepository;
import com.se330.ctuong_backend.repository.UserRepository;
import com.se330.ctuong_backend.service.GameMessageService;
import com.se330.ctuong_backend.service.elo.EloService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.SchedulerException;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class GameResignService {
    private final GameMessageService gameMessageService;
    private final GameRepository gameRepository;
    private final EloService eloService;
    private final UserRepository userRepository;
    private final GameFinalizerService gameFinalizerService;

    public void resign(String gameId, Long playerId) throws SchedulerException {
        var game = gameRepository.getGameById(gameId);
        if (game == null) {
            throw new IllegalArgumentException("Game not found");
        }
        final var player = userRepository.getUserById(playerId).orElseThrow(() ->
                new IllegalStateException("User not found with id: " + playerId));

        final var isWhite = game.getWhitePlayer().getId().equals(player.getId());
        final var isBlack = game.getBlackPlayer().getId().equals(player.getId());
        if (!isBlack && !isWhite) {
            throw new IllegalArgumentException("User is not a participant in the game");
        }

        if (game.getIsEnded()) {
            return;
        }

        GameResult gameResult;
        if (isWhite) {
            gameResult = GameResult.builder().blackWin().byResignation();
        } else {
            gameResult = GameResult.builder().whiteWin().byResignation();
        }
        gameFinalizerService.finalizeGame(game.getId(), gameResult);

    }
}
