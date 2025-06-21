package com.se330.ctuong_backend.service.elo;

import com.se330.xiangqi.GameResult;

public interface EloService {
    void updateElo(String gameId, GameResult gameResult);
}
