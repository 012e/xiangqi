package com.se330.ctuong_backend.service.game;

import com.se330.ctuong_backend.dto.rest.GameResponse;
import com.se330.ctuong_backend.model.Game;
import com.se330.ctuong_backend.repository.GameRepository;
import com.se330.ctuong_backend.service.GameTimeoutService;
import com.se330.xiangqi.Xiangqi;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.quartz.SchedulerException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameQueryService {
    private final GameRepository gameRepository;
    private final GameTimeoutService gameTimeoutService;
    private final ModelMapper mapper;

    public Optional<GameResponse> getGameById(String gameId) throws SchedulerException {
        final var game = gameRepository.getGameById(gameId);
        if (game == null) {
            return Optional.empty();
        }
        // TODO: persist or cache
        patchTimeLeft(game);

        final var result = mapper.map(game, GameResponse.class);
        return Optional.of(result);
    }

    private static boolean isWhiteTurn(Xiangqi gameLogic) {
        return gameLogic.getCurrentPlayerColor().equals("white");
    }

    private void patchTimeLeft(Game game) throws SchedulerException {
        final var gameLogic = Xiangqi.fromUciFen(game.getUciFen());
        if (!game.getIsStarted() || game.getIsEnded()) {
            return;
        }
        if (isWhiteTurn(gameLogic)) {
            game.setWhiteTimeLeft(gameTimeoutService.getNextTimeout(game.getId()));
        } else {
            game.setBlackTimeLeft(gameTimeoutService.getNextTimeout(game.getId()));
        }
    }
}