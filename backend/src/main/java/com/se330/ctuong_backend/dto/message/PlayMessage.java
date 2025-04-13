package com.se330.ctuong_backend.dto.message;

import lombok.Data;

@Data
public class PlayMessage extends BoardStateMessage<PlayData> {
    protected BoardState type = BoardState.Play;
    private PlayData data;

    public PlayMessage(PlayData data) {
        this.data = data;
    }
}
