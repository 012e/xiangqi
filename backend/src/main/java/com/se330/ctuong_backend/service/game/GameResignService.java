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
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class GameResignService {
    private final GameMessageService gameMessageService;
    private final GameRepository gameRepository;
    private final EloService eloService;
    private final UserRepository userRepository;

    public void resign(String gameId, Long playerId) {
        var game = gameRepository.getGameById(gameId);
        if (game == null) {
            throw new IllegalArgumentException("Game not found");
        }
        if (game.getIsEnded()) {
            return;
        }
        final var player = userRepository.getUserById(playerId).orElseThrow(() ->
                new IllegalStateException("User not found with id: " + playerId));
        GameResult gameResult;
        final var isWhite = game.getWhitePlayer().getId().equals(player.getId());
        if (isWhite) {
            gameResult = GameResult.builder().blackWin().byResignation();
        } else {
            gameResult = GameResult.builder().whiteWin().byResignation();
        }

        game.setEndTime(Instant.now());
        game.setResult(gameResult.getResult());
        game.setResultDetail(gameResult.getDetail());
        game.setIsEnded(true);
        gameRepository.save(game);

        final var updatedElo = eloService.updateElo(game.getId(),
                isWhite ? com.se330.xiangqi.GameResult.BLACK_WIN : com.se330.xiangqi.GameResult.WHITE_WIN);

        final var gameEndData = GameEndData.builder()
                .result(gameResult)
                .blackEloChange(updatedElo.getBlackEloChange().longValue())
                .whiteEloChange(updatedElo.getWhiteEloChange().longValue())
                .build();


        gameMessageService.sendMessageGameTopic(gameId, new GameEndMessage(gameEndData));
    }
}
