package com.se330.ctuong_backend.service.game;

import com.se330.ctuong_backend.dto.CreateGameDto;
import com.se330.ctuong_backend.dto.GameDto;
import com.se330.ctuong_backend.dto.rest.GameResponse;
import com.se330.ctuong_backend.repository.UserRepository;
import com.se330.xiangqi.Move;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.SchedulerException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameService {
    private final GameCreationService gameCreationService;
    private final GameMoveService gameMoveService;
    private final GameTimeoutHandlerService gameTimeoutHandlerService;
    private final GameQueryService gameQueryService;
    private final GameResignService gameResignService;
    private final UserRepository userRepository;
    private final GameDrawService gameOfferDrawService;

    public GameDto createGame(@Valid CreateGameDto dto) {
        return gameCreationService.createGame(dto);
    }

    public void markTimeout(@NotNull String gameId) throws SchedulerException {
        gameTimeoutHandlerService.markTimeout(gameId);
    }

    public void handleBotMove(String gameId, Move move) throws SchedulerException {
        gameMoveService.handleBotMove(gameId, move);
    }

    public void handleHumanMove(String gameId, Move move) throws SchedulerException {
        gameMoveService.handleHumanMove(gameId, move);
    }

    public Optional<GameResponse> getGameById(String gameId) throws SchedulerException {
        return gameQueryService.getGameById(gameId);
    }

    public void resign(String gameId, String sub) throws SchedulerException {
        final var user = userRepository.getUserBySub(sub)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        gameResignService.resign(gameId, user.getId());
    }

    public void offerDraw(String gameId, String sub) throws SchedulerException {
        final var user = userRepository.getUserBySub(sub)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        gameOfferDrawService.offerDraw(gameId, user.getId());
    }

    public void declineDraw(String gameId, String sub) throws SchedulerException {
        final var user = userRepository.getUserBySub(sub)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        gameOfferDrawService.declineDraw(gameId, user.getId());
    }
}