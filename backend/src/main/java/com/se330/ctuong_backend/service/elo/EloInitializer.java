package com.se330.ctuong_backend.service.elo;

public interface EloInitializer {
    void initializeEloIfNotExists(Long playerId, Long gameTypeId);
}
