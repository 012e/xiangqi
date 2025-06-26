package com.se330.ctuong_backend.dto.message.game.state;

import com.se330.ctuong_backend.dto.message.BoardState;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = false)
@Data
public class DrawOfferingMessage extends GameMessage<DrawOfferingData> {
    protected BoardState type = BoardState.DrawOffering;
    private DrawOfferingData data;

    public DrawOfferingMessage(DrawOfferingData data) {
        this.data = data;
    }
}
