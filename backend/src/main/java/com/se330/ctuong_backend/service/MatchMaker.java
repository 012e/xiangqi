package com.se330.ctuong_backend.service;

import com.se330.ctuong_backend.dto.message.CreateGameMessage;

public interface MatchMaker {
    void addToPool(Long userId, CreateGameMessage createGameMessage);
}
