package com.se330.ctuong_backend.service.game;

import com.se330.ctuong_backend.dto.message.game.state.GameEndData;
import com.se330.ctuong_backend.dto.message.game.state.GameEndMessage;
import com.se330.ctuong_backend.dto.message.game.state.GameResult;
import com.se330.ctuong_backend.model.Game;
import com.se330.ctuong_backend.repository.GameRepository;
import com.se330.ctuong_backend.service.GameMessageService;
import com.se330.ctuong_backend.service.elo.EloService;
import com.se330.xiangqi.Xiangqi;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;

import static com.se330.xiangqi.GameResult.BLACK_WIN;
import static com.se330.xiangqi.GameResult.WHITE_WIN;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameEndService {
    private final GameRepository gameRepository;
    private final GameMessageService gameMessageService;
    private final EloService eloService;

    public void handleGameEnd(String gameId, Xiangqi gameLogic, Game game) {
        final var result = gameLogic.getResult();

        GameResult gameResult;

        // This game result does not include external reasons like timeout/resign
        switch (result) {
            case BLACK_WIN -> gameResult = GameResult
                    .builder()
                    .blackWin()
                    .byCheckmate();
            case WHITE_WIN -> gameResult = GameResult
                    .builder()
                    .whiteWin()
                    .byCheckmate();
            case DRAW -> {
                final var draw = GameResult.builder().draw();
                if (gameLogic.isInsufficientMaterial()) {
                    gameResult = draw.byInsufficientMaterial();
                } else {
                    gameResult = draw.byStalemate();
                }
            }
            default -> throw new IllegalStateException("Unexpected value: " + result);
        }

        game.setEndTime(Instant.now());
        game.setResult(gameResult.getResult());
        game.setResultDetail(gameResult.getDetail());
        game.setIsEnded(true);
        gameRepository.save(game);
        final var updatedElo = eloService.updateElo(game.getId(), result);

        final var gameEndData = GameEndData.builder()
                .result(gameResult)
                .blackEloChange(updatedElo.getBlackEloChange().longValue())
                .whiteEloChange(updatedElo.getWhiteEloChange().longValue())
                .build();

        gameMessageService.sendMessageGameTopic(gameId, new GameEndMessage(gameEndData));
    }
}