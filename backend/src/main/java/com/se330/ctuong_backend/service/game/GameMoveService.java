package com.se330.ctuong_backend.service.game;

import com.se330.ctuong_backend.dto.message.PlayData;
import com.se330.ctuong_backend.dto.message.game.state.PlayMessage;
import com.se330.ctuong_backend.model.Game;
import com.se330.ctuong_backend.repository.GameRepository;
import com.se330.ctuong_backend.service.BotMessageService;
import com.se330.ctuong_backend.service.GameMessageService;
import com.se330.ctuong_backend.service.GameTimeoutService;
import com.se330.xiangqi.Move;
import com.se330.xiangqi.Xiangqi;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.SchedulerException;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameMoveService {
    private final GameRepository gameRepository;
    private final GameTimeoutService gameTimeoutService;
    private final GameMessageService gameMessageService;
    private final BotMessageService botMessageService;
    private final GameCreationService gameCreationService;
    private final GameEndService gameEndService;

    public void handleBotMove(String gameId, Move move) throws SchedulerException {
        final var game = gameRepository.getGameById(gameId);
        if (game == null) {
            throw new IllegalArgumentException("Game not found");
        }

        handleMove(game, move);
    }

    public void handleHumanMove(String gameId, Move move) throws SchedulerException {
        final var game = gameRepository.getGameById(gameId);
        if (game == null) {
            throw new IllegalArgumentException("Game not found");
        }
        handleMove(game, move);

        if (game.isGameWithBot()) {
            botMessageService.makeBotMove(game.getId());
        }
    }

    private void handleMove(Game game, Move move) throws SchedulerException {
        final var beginCalculationTime = Instant.now();
        final var gameLogic = Xiangqi.fromUciFen(game.getUciFen());

        if (game.getIsEnded()) {
            return;
        }

        if (!gameLogic.isLegalMove(move).isOk()) {
            return;
        }

        if (game.getUciFen().equals(Xiangqi.INITIAL_UCI_FEN)) {
            gameCreationService.startGame(game);
        }

        gameLogic.move(move);
        final var fen = gameLogic.exportUciFen();

        game.setUciFen(fen);
        if (gameLogic.isWhiteTurn()) {
            game.updateBlackTime(); // previous was black's move
            gameTimeoutService.replaceTimerOrCreateNew(game.getId(), game.getWhiteTimeLeft());
            game.beginWhiteCounter();
        } else {
            game.updateWhiteTime(); // previous was white's move
            gameTimeoutService.replaceTimerOrCreateNew(game.getId(), game.getBlackTimeLeft());
            game.beginBlackCounter();
        }

        final var message = PlayData.builder()
                .fen(game.getUciFen())
                .player(gameLogic.getCurrentPlayerColor())
                .from(move.getFrom())
                .to(move.getTo())
                .blackTime(game.getBlackTimeLeft().toMillis())
                .whiteTime(game.getWhiteTimeLeft().toMillis())
                .uciFen(fen)
                .build();
        gameRepository.save(game);

        final var endCalculationTime = Instant.now();

        final var timeLoss = Duration.between(beginCalculationTime, endCalculationTime);
        gameTimeoutService.compensateLoss(game.getId(), timeLoss);
        log.trace("Compensated loss: {}ms for game with ID {}", timeLoss.toMillis(), game.getId());

        gameMessageService.sendMessageGameTopic(game.getId(), new PlayMessage(message));
        if (gameLogic.isGameOver()) {
            gameEndService.handleGameEnd(game.getId(), gameLogic, game);
        }
    }
}