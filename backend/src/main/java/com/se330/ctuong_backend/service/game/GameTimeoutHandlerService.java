package com.se330.ctuong_backend.service.game;

import com.se330.ctuong_backend.dto.message.game.state.GameEndMessage;
import com.se330.ctuong_backend.dto.message.game.state.GameResult;
import com.se330.ctuong_backend.model.Game;
import com.se330.ctuong_backend.repository.GameRepository;
import com.se330.ctuong_backend.service.GameMessageService;
import com.se330.ctuong_backend.service.GameTimeoutService;
import com.se330.ctuong_backend.service.elo.EloService;
import com.se330.xiangqi.Xiangqi;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.SchedulerException;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;

import static com.se330.xiangqi.GameResult.BLACK_WIN;
import static com.se330.xiangqi.GameResult.WHITE_WIN;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameTimeoutHandlerService {
    private final GameRepository gameRepository;
    private final GameTimeoutService gameTimeoutService;
    private final GameMessageService gameMessageService;
    private final EloService eloService;

    // TODO: handle insufficient material
    public void markTimeout(@NotNull String gameId) throws SchedulerException {
        var game = gameRepository.getGameById(gameId);
        if (game == null) {
            throw new IllegalArgumentException("Game not found");
        }

        final var gameLogic = Xiangqi.fromUciFen(game.getUciFen());
        final var currentPlayerColor = gameLogic.getCurrentPlayerColor();

        GameResult result;

        if (currentPlayerColor.equals("white")) {
            result = GameResult.builder().blackWin().byTimeout();
            game.setWhiteTimeLeft(Duration.ofMillis(0));
        } else {
            result = GameResult.builder().whiteWin().byTimeout();
            game.setBlackTimeLeft(Duration.ofMillis(0));
        }

        game.setEndTime(Instant.now());
        game.setResult(result.getResult());
        game.setResultDetail(result.getDetail());
        game.setIsEnded(true);

        gameRepository.save(game);
        gameTimeoutService.removeTimerIfExists(gameId);
        final var resultDto = switch (result.getResult()) {
            case "black_win" -> BLACK_WIN;
            case "white_win" -> WHITE_WIN;
            default -> throw new IllegalStateException("Unexpected value: " + result.getResult());
        };
        eloService.updateElo(game.getId(), resultDto);

        gameMessageService.sendMessageGameTopic(gameId, new GameEndMessage(result));
    }
}