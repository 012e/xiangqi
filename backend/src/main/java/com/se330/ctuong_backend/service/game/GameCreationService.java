package com.se330.ctuong_backend.service.game;

import com.se330.ctuong_backend.dto.CreateGameDto;
import com.se330.ctuong_backend.dto.GameDto;
import com.se330.ctuong_backend.model.Game;
import com.se330.ctuong_backend.model.GameTypeRepository;
import com.se330.ctuong_backend.repository.GameRepository;
import com.se330.ctuong_backend.repository.UserRepository;
import com.se330.ctuong_backend.service.elo.EloInitializer;
import com.se330.xiangqi.Xiangqi;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameCreationService {
    private final GameRepository gameRepository;
    private final GameTypeRepository gameTypeRepository;
    private final UserRepository userRepository;
    private final EloInitializer eloInitializer;
    private final ModelMapper mapper;

    @Transactional
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
        
        eloInitializer.initializeEloIfNotExists(black.getId(), gameType.getId());
        eloInitializer.initializeEloIfNotExists(white.getId(), gameType.getId());

        final var blackStats = userRepository.getGameStatByUserId(black.getId(), gameType.getId())
                .orElseThrow(() -> new IllegalArgumentException("Black player stats not found"));

        final var whiteStats = userRepository.getGameStatByUserId(white.getId(), gameType.getId())
                .orElseThrow(() -> new IllegalArgumentException("White player stats not found"));

        final var newGameBuilder = Game.builder()
                .gameType(gameType)
                .blackPlayer(black)
                .blackElo(blackStats.getElo())
                .whiteElo(whiteStats.getElo())
                .whitePlayer(white)
                .blackTimeLeft(gameType.getTimeControl())
                .whiteTimeLeft(gameType.getTimeControl())
                .uciFen(Xiangqi.INITIAL_UCI_FEN)
                .whiteLastDrawOffer(-1)
                .blackLastDrawOffer(-1)
                .isWhiteOfferingDraw(false)
                .isBlackOfferingDraw(false)
                .isStarted(false)
                .isEnded(false);

        if (dto.getBotStrength() != null) {
            newGameBuilder.botStrength(dto.getBotStrength());
        }

        final var newGame = newGameBuilder.build();
        gameRepository.save(newGame);

        return mapper.map(newGame, GameDto.class);
    }

    public void startGame(Game game) {
        game.setIsStarted(true);
        game.setWhiteCounterStart(Instant.now());
        game.setStartTime(Timestamp.from(Instant.now()));
    }
}