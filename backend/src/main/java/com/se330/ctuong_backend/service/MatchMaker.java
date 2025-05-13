package com.se330.ctuong_backend.service;

import com.se330.ctuong_backend.dto.message.Game;

public interface MatchMaker {
    void addToPlayerPool(Long userId, Game.CreateGameMessage createGameMessage);
}
