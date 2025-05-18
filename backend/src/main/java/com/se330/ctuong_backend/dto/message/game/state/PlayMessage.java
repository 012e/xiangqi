package com.se330.ctuong_backend.dto.message.game.state;

import com.se330.ctuong_backend.dto.message.BoardState;
import com.se330.ctuong_backend.dto.message.PlayData;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class PlayMessage extends GameMessage<PlayData> {
    protected BoardState type = BoardState.Play;
    private PlayData data;

    public PlayMessage(PlayData data) {
        this.data = data;
    }
}
