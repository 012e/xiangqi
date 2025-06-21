package com.se330.ctuong_backend.repository;


import com.se330.ctuong_backend.model.GameType;
import lombok.Data;

import java.time.Duration;

@Data
public class GameStat {
    private final Long gameTypeId;
    private final String gameTypeName;
    private final Long totalGames;
    private final Double elo;
}
