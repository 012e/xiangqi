package com.se330.ctuong_backend.service.game;

import com.se330.ctuong_backend.dto.message.game.state.GameEndData;
import com.se330.ctuong_backend.dto.message.game.state.GameEndMessage;
import com.se330.ctuong_backend.dto.message.game.state.GameMessage;
import com.se330.ctuong_backend.dto.message.game.state.GameResult;
import com.se330.ctuong_backend.model.Game;
import com.se330.ctuong_backend.repository.GameRepository;
import com.se330.ctuong_backend.service.GameMessageService;
import com.se330.ctuong_backend.service.GameTimeoutService;
import com.se330.ctuong_backend.service.elo.EloService;
import com.se330.xiangqi.Xiangqi;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.quartz.SchedulerException;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class GameFinalizerService {
    private final GameRepository gameRepository;
    private final EloService eloService;
    private final GameMessageService gameMessageService;
    private final GameTimeoutService gameTimeoutService;

    private static boolean isWhiteTurn(Xiangqi gameLogic) {
        return gameLogic.getCurrentPlayerColor().equals("white");
    }

    private void patchTimeLeft(Game game) throws SchedulerException {
        final var gameLogic = Xiangqi.fromUciFen(game.getUciFen());
        if (!game.getIsStarted()) {
            return;
        }
        if (isWhiteTurn(gameLogic)) {
            game.setWhiteTimeLeft(gameTimeoutService.getNextTimeout(game.getId()));
        } else {
            game.setBlackTimeLeft(gameTimeoutService.getNextTimeout(game.getId()));
        }
    }


    @Transactional
    public void finalizeGame(String gameId, GameResult gameResult) throws SchedulerException {
        var game = gameRepository.getGameById(gameId);
        if (game == null) {
            throw new IllegalArgumentException("Game not found");
        }
        if (game.getIsEnded()) {
            return;
        }

        game.setResult(gameResult.getResult());
        game.setResultDetail(gameResult.getDetail());
        game.setEndTime(Instant.now());
        game.setIsEnded(true);
        patchTimeLeft(game);
        gameTimeoutService.removeTimerIfExists(game.getId());
        gameRepository.save(game);

        final var resultDto = switch (gameResult.getResult()) {
            case "black_win" -> com.se330.xiangqi.GameResult.BLACK_WIN;
            case "white_win" -> com.se330.xiangqi.GameResult.WHITE_WIN;
            case "draw" -> com.se330.xiangqi.GameResult.DRAW;
            default -> throw new IllegalStateException("Unexpected value: " + gameResult.getResult());
        };

        final var updatedElo = eloService.updateElo(game.getId(), resultDto);

        final var gameEndData = GameEndData.builder()
                .result(gameResult)
                .blackEloChange(updatedElo.getBlackEloChange().longValue())
                .whiteEloChange(updatedElo.getWhiteEloChange().longValue())
                .build();

        gameMessageService.sendMessageGameTopic(gameId, new GameEndMessage(gameEndData));
    }
}
