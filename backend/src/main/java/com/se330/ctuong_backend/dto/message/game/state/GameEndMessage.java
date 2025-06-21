package com.se330.ctuong_backend.dto.message.game.state;

import com.se330.ctuong_backend.dto.message.BoardState;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = false)
@Data
public class GameEndMessage extends GameMessage<GameEndData> {
    protected BoardState type = BoardState.GameEnd;
    private GameEndData data;

    public GameEndMessage(GameEndData data) {
        this.data = data;
    }
}

