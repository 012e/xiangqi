package com.se330.ctuong_backend.dto.message;

import lombok.Data;

@Data
public class GameEndMessage extends BoardStateMessage<GameEndData> {
    protected BoardState type = BoardState.GameEnd;
    private GameEndData data;

    public GameEndMessage(GameEndData data) {
        this.data = data;
    }
}
