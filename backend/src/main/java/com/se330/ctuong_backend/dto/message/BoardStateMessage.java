package com.se330.ctuong_backend.dto.message;

public abstract class BoardStateMessage<T> {
    protected static BoardState type = BoardState.GameEnd;
    private T data;
}
