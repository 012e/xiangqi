package com.se330.ctuong_backend.service.elo;

import com.se330.ctuong_backend.repository.EloRepository;
import com.se330.ctuong_backend.repository.GameRepository;
import com.se330.ctuong_backend.repository.UserRepository;
import com.se330.xiangqi.GameResult;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EloServiceImpl implements EloService {
    private final EloCalculator eloCalculator;
    private final GameRepository gameRepository;
    private final UserRepository userRepository;
    private final EloRepository eloRepository;
    private final EloInitializer eloInitializer;

    @Override
    @Transactional
    public UpdateEloResult updateElo(String gameId, GameResult gameResult) {
        final var game = gameRepository.findById(gameId)
                .orElseThrow(() -> new IllegalArgumentException("Game not found with id: " + gameId));

        final var black = game.getBlackPlayer();
        final var white = game.getWhitePlayer();
        final var gameType = game.getGameType();
        Long gameTypeId = game.getGameType().getId();

        final var whiteStats = userRepository.getGameStatByUserId(game.getWhitePlayer().getId(), gameTypeId)
                .orElseGet(() -> {
                    eloInitializer.initializeEloIfNotExists(white.getId(), gameType.getId());
                    return userRepository.getGameStatByUserId(white.getId(), gameType.getId())
                            .orElseThrow(() -> new IllegalStateException("Default elo not initialized"));
                });

        final var blackStats = userRepository.getGameStatByUserId(game.getBlackPlayer().getId(), gameTypeId)
                .orElseGet(() -> {
                    eloInitializer.initializeEloIfNotExists(black.getId(), gameType.getId());
                    return userRepository.getGameStatByUserId(black.getId(), gameType.getId())
                            .orElseThrow(() -> new IllegalStateException("Default elo not initialized"));
                });

        final var whiteDto = EloCalculatorArgs.Player.builder()
                .gamePlayed(whiteStats.getTotalGames())
                .elo(whiteStats.getElo())
                .build();

        final var blackDto = EloCalculatorArgs.Player.builder()
                .gamePlayed(blackStats.getTotalGames())
                .elo(blackStats.getElo())
                .build();

        final var eloCalculatorArgs = EloCalculatorArgs.builder()
                .black(blackDto)
                .white(whiteDto)
                .result(gameResult)
                .build();

        final var newBlackElo = eloCalculator.calculateBlackElo(eloCalculatorArgs);
        final var newWhiteElo = eloCalculator.calculateWhiteElo(eloCalculatorArgs);
        final var blackEloChange = newBlackElo - blackDto.getElo();
        final var whiteEloChange = newWhiteElo - whiteDto.getElo();

        game.setWhiteEloChange(whiteEloChange);
        game.setBlackEloChange(blackEloChange);

        eloRepository.updateEloByUserId(game.getBlackPlayer().getId(), gameTypeId, newBlackElo);
        eloRepository.updateEloByUserId(game.getWhitePlayer().getId(), gameTypeId, newWhiteElo);

        gameRepository.save(game);

        return UpdateEloResult.builder()
                .blackEloChange(blackEloChange)
                .whiteEloChange(whiteEloChange)
                .whiteNewElo(newWhiteElo)
                .blackNewElo(newBlackElo)
                .build();
    }
}
