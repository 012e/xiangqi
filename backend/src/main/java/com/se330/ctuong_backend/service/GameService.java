package com.se330.ctuong_backend.service;

import com.mchange.rmi.NotAuthorizedException;
import com.se330.ctuong_backend.dto.CreateGameDto;
import com.se330.ctuong_backend.dto.GameDto;
import com.se330.ctuong_backend.dto.message.game.state.GameEndMessage;
import com.se330.ctuong_backend.dto.message.game.state.GameResult;
import com.se330.ctuong_backend.dto.message.PlayData;
import com.se330.ctuong_backend.model.Game;
import com.se330.ctuong_backend.model.GameTypeRepository;
import com.se330.ctuong_backend.repository.GameRepository;
import com.se330.ctuong_backend.repository.UserRepository;
import com.se330.xiangqi.Move;
import com.se330.xiangqi.Xiangqi;
import io.micrometer.common.lang.Nullable;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.quartz.SchedulerException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GameService {
    private final GameTimeoutService gameTimeoutService;
    private final GameRepository gameRepository;
    private final GameTypeRepository gameTypeRepository;
    private final UserRepository userRepository;
    private final GameMessageService gameMessageService;
    private final ModelMapper mapper;

    public GameDto createGame(@Valid CreateGameDto dto) throws NotAuthorizedException {
        final var white = userRepository
                .getUserById(dto.getWhiteId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        final var black = userRepository
                .getUserById(dto.getBlackId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        final var gameType = gameTypeRepository
                .findById(dto.getGameTypeId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid game type"));

        final var newGame = Game.builder()
                .gameType(gameType)
                .blackPlayer(black)
                .whitePlayer(white)
                .uciFen(Xiangqi.INITIAL_UCI_FEN)
                .build();
        gameRepository.save(newGame);

        return mapper.map(newGame, GameDto.class);
    }

    public void startGame(String gameId) throws SchedulerException {
        final var game = gameRepository.getGameById(gameId);
        if (game == null) {
            throw new IllegalArgumentException("Game not found");
        }

        // TODO: retry
        gameTimeoutService.addTimeoutTimer(gameId, game.getGameType().getTimeControl());
        game.setIsStarted(true);
        gameRepository.save(game);
    }

    public void markTimeout(@NotNull String gameId) throws SchedulerException {
        var game = gameRepository.getGameById(gameId);
        if (game == null) {
            throw new IllegalArgumentException("Game not found");
        }

        final var gameLogic = Xiangqi.fromUciFen(game.getUciFen());
        final var currentPlayerColor = gameLogic.getCurrentPlayerColor();

        GameResult result;

        if (currentPlayerColor.equals("w")) {
            result = GameResult.builder().blackWin().byTimeout();
        } else {
            result = GameResult.builder().whiteWin().byTimeout();
        }

        game.setEndTime(Instant.now());
        game.setResult(result.getResult());
        game.setResultDetail(result.getDetail());

        gameRepository.save(game);
        gameTimeoutService.removeTimerIfExists(gameId);
        
        gameMessageService.sendMessageGameTopic(gameId, new GameEndMessage(result));
    }

    public @Nullable PlayData moveIfValid(String gameId, Move move) throws SchedulerException {
        final var game = gameRepository.getGameById(gameId);
        if (game == null) {
            throw new IllegalArgumentException("Game not found");
        }
        final var gameLogic = Xiangqi.fromUciFen(game.getUciFen());

        if (isGameOver(game)) {
            return null;
        }

        if (!gameLogic.isLegalMove(move).isOk()) {
            return null;
        }

        if (game.getUciFen().equals(Xiangqi.INITIAL_UCI_FEN)) {
            startGame(game.getId());
        }

        gameLogic.move(move);
        final var fen = gameLogic.exportUciFen();

        final var currentTime = Instant.now();
        final var previousMoveTime = game.getLastMoveTime();
        final var diff = currentTime.getEpochSecond() - previousMoveTime.getEpochSecond();

        game.setUciFen(fen);
        game.setLastMoveTime(currentTime);
        if (gameLogic.getCurrentPlayerColor().equals("white")) {
            // The previous player is black
            game.setBlackTimeLeft(diff);
        } else {
            game.setBlackTimeLeft(diff);
        }

        gameRepository.save(game);

        return PlayData.builder()
                .fen(game.getUciFen())
                .player(gameLogic.getCurrentPlayerColor())
                .from(move.getFrom())
                .to(move.getTo())
                .uciFen(fen)
                .build();
    }

    public boolean isGameStarted(String gameId) {
        final var game = gameRepository.getGameById(gameId);

        if (game == null) {
            throw new IllegalArgumentException("Game not found");
        }

        return game.getIsStarted();
    }

    private boolean isGameOver(@NotNull Game game) {
        return game.getEndTime() != null;
    }

    public boolean isGameOver(String gameId) {
        final var game = gameRepository.getGameById(gameId);

        if (game == null) {
            throw new IllegalArgumentException("Game not found");
        }
        return game.getEndTime() != null;
    }

    public Optional<GameDto> getGameById(String gameId) {
        final var game = gameRepository.getGameById(gameId);
        if (game == null) {
            return Optional.empty();
        }
        return Optional.of(mapper.map(game, GameDto.class));
    }
}
