package com.se330.ctuong_backend.dto.message.game.state;

import com.se330.ctuong_backend.dto.message.BoardState;

public abstract class BoardStateMessage<T> {
    protected static BoardState type = BoardState.GameEnd;
    private T data;
}
