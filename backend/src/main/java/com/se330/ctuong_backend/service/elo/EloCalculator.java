package com.se330.ctuong_backend.service.elo;

public interface EloCalculator {
    double calculateBlackElo(EloCalculatorArgs args);
    double calculateWhiteElo(EloCalculatorArgs args);
}
