package com.se330.ctuong_backend.dto.message.game.state;

import com.se330.ctuong_backend.dto.message.BoardState;
import com.se330.ctuong_backend.dto.message.PlayData;
import lombok.Data;

@Data
public class GameEndMessage extends BoardStateMessage<GameResult> {
    protected BoardState type = BoardState.GameEnd;
    private GameResult data;

    public GameEndMessage(GameResult data) {
        this.data = data;
    }
}

