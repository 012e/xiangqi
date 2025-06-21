package com.se330.ctuong_backend.service.engine;

import com.se330.ctuong_backend.repository.GameRepository;
import com.se330.ctuong_backend.service.game.GameService;
import com.se330.xiangqi.Xiangqi;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.SchedulerException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EngineService {
    private final FairyStockFishEngineFactory fairyStockFishEngineFactory;
    private final GameRepository gameRepository;
    private final GameService gameService;

    public void move(String gameId) {
        final var game = gameRepository.getGameById(gameId);
        if (game == null) {
            throw new IllegalArgumentException("Game not found");
        }

        if (game.getBotStrength() == null) {
            throw new IllegalStateException("Bot strength is not set for the game. Possibly the game is not valid.");
        }

        final var gameLogic = Xiangqi.fromUciFen(game.getUciFen());

        final var engine = fairyStockFishEngineFactory.borrow();
        try {
            final var generateMoveArgs = FairyStockFishEngine.MoveGenerationArgs.builder()
                    .fen(gameLogic.exportFen())
                    .strength(game.getBotStrength())
                    .blackTimeLeft(game.getBlackTimeLeft())
                    .whiteTimeLeft(game.getWhiteTimeLeft())
                    .build();
            final var move = engine.generateMove(generateMoveArgs);
            gameService.handleBotMove(gameId, move);
        } catch (SchedulerException e) {
            throw new RuntimeException(e);
        } finally {
            fairyStockFishEngineFactory.restore(engine);
        }
    }
}
