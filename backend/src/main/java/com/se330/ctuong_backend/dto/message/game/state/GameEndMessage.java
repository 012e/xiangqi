package com.se330.ctuong_backend.dto.message.game.state;

import com.se330.ctuong_backend.dto.message.BoardState;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = false)
@Data
public class GameEndMessage extends GameMessage<GameResult> {
    protected BoardState type = BoardState.GameEnd;
    private GameResult data;

    public GameEndMessage(GameResult data) {
        this.data = data;
    }
}

