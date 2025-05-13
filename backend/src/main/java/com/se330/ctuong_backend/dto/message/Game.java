package com.se330.ctuong_backend.dto.message;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Game {
    private String gameId;
    private Long blackPlayerId;
    private Long whitePlayerId;

    @Data
    @AllArgsConstructor
    public static class CreateGameMessage {
        private Long gameTypeId;
    }
}
