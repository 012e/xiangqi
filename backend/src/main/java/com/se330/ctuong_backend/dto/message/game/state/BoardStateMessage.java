package com.se330.ctuong_backend.dto.message.game.state;

import com.se330.ctuong_backend.dto.message.BoardState;

public abstract class BoardStateMessage<T extends MessageData> {
    public BoardState type = BoardState.GameEnd;
    private T data;
}
