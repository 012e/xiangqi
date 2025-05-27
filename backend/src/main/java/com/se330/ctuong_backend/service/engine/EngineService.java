package com.se330.ctuong_backend.service.engine;

import com.se330.ctuong_backend.config.ApplicationConfiguration;
import com.se330.ctuong_backend.dto.GameDto;
import com.se330.ctuong_backend.repository.GameRepository;
import com.se330.ctuong_backend.service.GameService;
import com.se330.xiangqi.Move;
import com.se330.xiangqi.Xiangqi;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class EngineService {
    private final FairyStockFishEngineFactory fairyStockFishEngineFactory;
    private final GameRepository gameRepository;

    private String getOurColor(GameDto game, Xiangqi gameLogic) {
        final var whiteId = game.getWhitePlayer().getId();
        if (Objects.equals(whiteId, ApplicationConfiguration.getBotId())) {
            return "white";
        } else if (Objects.equals(game.getBlackPlayer().getId(), ApplicationConfiguration.getBotId())) {
            return "black";
        }
        throw new IllegalStateException("Not a game with bot");
    }

    private boolean isOurTurn(GameDto game, Xiangqi gameLogic) {
        final var color = getOurColor(game, gameLogic);
        if (color.equals("white")) {
            return gameLogic.isWhiteTurn();
        } else if (color.equals("black")) {
            return !gameLogic.isWhiteTurn();
        }
        return false;
    }

    public Move generateMove(GameDto gameDto) {
        final var game = gameRepository.getGameById(gameDto.getId());
        if (game == null) {
            throw new IllegalArgumentException("Game not found");
        }

        if (game.getBotStrength() == null) {
            throw new IllegalStateException("Bot strength is not set for the game. Possibly the game is not valid.");
        }

        final var gameLogic = Xiangqi.fromUciFen(game.getUciFen());
        gameLogic.isWhiteTurn();

        final var engine = fairyStockFishEngineFactory.borrow();
        try {
            final var generateMoveArgs = FairyStockFishEngine.MoveGenerationArgs.builder()
                    .fen(gameLogic.exportFen())
                    .strength(game.getBotStrength())
                    .blackTimeLeft(game.getBlackTimeLeft())
                    .whiteTimeLeft(game.getWhiteTimeLeft())
                    .build();
            return engine.generateMove(generateMoveArgs);
        } finally {
            fairyStockFishEngineFactory.restore(engine);
        }
    }
}
