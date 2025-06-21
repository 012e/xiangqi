package com.se330.ctuong_backend.service.elo;

import com.se330.ctuong_backend.dto.message.game.state.GameResult;
import org.springframework.stereotype.Service;

import static com.se330.xiangqi.GameResult.*;

@Service
public class StandardEloCalculator implements EloCalculator {

    // Thresholds for K-factor calculation
    private static final long NEW_PLAYER_GAME_THRESHOLD = 30L;
    private static final double HIGH_RATED_ELO_THRESHOLD = 2400.0;

    // K-factor values
    private static final double K_FACTOR_NEW_PLAYER = 40;
    private static final double K_FACTOR_ESTABLISHED_LOWER_RATED = 20;
    private static final double K_FACTOR_ESTABLISHED_HIGH_RATED = 10;

    private double getKFactor(EloCalculatorArgs.Player player) {
        if (player.getGamePlayed() == null || player.getGamePlayed() < NEW_PLAYER_GAME_THRESHOLD) {
            return K_FACTOR_NEW_PLAYER;
        } else if (player.getElo() < HIGH_RATED_ELO_THRESHOLD) {
            return K_FACTOR_ESTABLISHED_LOWER_RATED;
        } else {
            return K_FACTOR_ESTABLISHED_HIGH_RATED;
        }
    }

    @Override
    public double calculateBlackElo(EloCalculatorArgs args) {
        double blackElo = args.getBlackPlayer().getElo();
        double whiteElo = args.getWhitePlayer().getElo();
        final var result = args.getResult();

        double kFactorBlack = getKFactor(args.getBlackPlayer());

        // Expected score for Black against White
        double expectedScoreBlack = 1.0 / (1.0 + Math.pow(10, (whiteElo - blackElo) / 400.0));

        double actualScoreBlack;
        switch (result) {
            case BLACK_WIN:
                actualScoreBlack = 1.0;
                break;
            case WHITE_WIN:
                actualScoreBlack = 0.0;
                break;
            case DRAW:
                actualScoreBlack = 0.5;
                break;
            default:
                actualScoreBlack = 0.5;
        }

        // Elo change for Black
        double eloChangeBlack = kFactorBlack * (actualScoreBlack - expectedScoreBlack);

        return blackElo + eloChangeBlack;
    }

    @Override
    public double calculateWhiteElo(EloCalculatorArgs args) {
        double whiteElo = args.getWhitePlayer().getElo();
        double blackElo = args.getBlackPlayer().getElo();
        final var result = args.getResult();

        double kFactorWhite = getKFactor(args.getWhitePlayer());

        // Expected score for White against Black
        double expectedScoreWhite = 1.0 / (1.0 + Math.pow(10, (blackElo - whiteElo) / 400.0));

        double actualScoreWhite;
        switch (result) {
            case WHITE_WIN:
                actualScoreWhite = 1.0;
                break;
            case BLACK_WIN:
                actualScoreWhite = 0.0;
                break;
            case DRAW:
                actualScoreWhite = 0.5;
                break;
            default:
                actualScoreWhite = 0.5;
        }

        // Elo change for White
        double eloChangeWhite = kFactorWhite * (actualScoreWhite - expectedScoreWhite);

        return whiteElo + eloChangeWhite;
    }
}