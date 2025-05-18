package com.se330.ctuong_backend.service;

import com.se330.ctuong_backend.dto.CreateGameDto;
import com.se330.ctuong_backend.dto.GameDto;
import com.se330.ctuong_backend.dto.message.game.state.GameEndMessage;
import com.se330.ctuong_backend.dto.message.game.state.GameResult;
import com.se330.ctuong_backend.dto.message.PlayData;
import com.se330.ctuong_backend.dto.message.game.state.PlayMessage;
import com.se330.ctuong_backend.dto.rest.GameResponse;
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
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.quartz.SchedulerException;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Duration;
import java.time.Instant;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameService {
    private final GameTimeoutService gameTimeoutService;
    private final GameRepository gameRepository;
    private final GameTypeRepository gameTypeRepository;
    private final UserRepository userRepository;
    private final GameMessageService gameMessageService;
    private final ModelMapper mapper;

    public GameDto createGame(@Valid CreateGameDto dto) {
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
                .blackTimeLeft(gameType.getTimeControl())
                .whiteTimeLeft(gameType.getTimeControl())
                .uciFen(Xiangqi.INITIAL_UCI_FEN)
                .isStarted(false)
                .isEnded(false)
                .build();
        gameRepository.save(newGame);

        return mapper.map(newGame, GameDto.class);
    }

    private void startGame(Game game) throws SchedulerException {
        game.setIsStarted(true);
        game.setWhiteCounterStart(Instant.now());
        game.setStartTime(Timestamp.from(Instant.now()));
    }

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

        gameMessageService.sendMessageGameTopic(gameId, new GameEndMessage(result));
    }

    public @Nullable void handleMove(String gameId, Move move) throws SchedulerException {
        final var beginCalculationTime = Instant.now();
        final var game = gameRepository.getGameById(gameId);
        if (game == null) {
            throw new IllegalArgumentException("Game not found");
        }
        final var gameLogic = Xiangqi.fromUciFen(game.getUciFen());

        if (game.getIsEnded()) {
            return;
        }

        if (!gameLogic.isLegalMove(move).isOk()) {
            return;
        }

        if (game.getUciFen().equals(Xiangqi.INITIAL_UCI_FEN)) {
            startGame(game);
        }

        gameLogic.move(move);
        final var fen = gameLogic.exportUciFen();

        game.setUciFen(fen);
        if (gameLogic.isWhiteTurn()) {
            game.updateBlackTime(); // previous was black's move
            gameTimeoutService.replaceTimerOrCreateNew(gameId, game.getWhiteTimeLeft());
            game.beginWhiteCounter();
        } else {
            game.updateWhiteTime(); // previous was white's move
            gameTimeoutService.replaceTimerOrCreateNew(gameId, game.getBlackTimeLeft());
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
        gameTimeoutService.compensateLoss(gameId, timeLoss);
        log.trace("Compensated loss: {}ms for game with ID {}", timeLoss.toMillis(), gameId);

        gameMessageService.sendMessageGameTopic(gameId, new PlayMessage(message));
        if (gameLogic.isGameOver()) {
            handleGameEnd(gameId, gameLogic, game);
        }
    }

    private void handleGameEnd(String gameId, Xiangqi gameLogic, Game game) {
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

        gameMessageService.sendMessageGameTopic(gameId, new GameEndMessage(gameResult));
    }

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
}
