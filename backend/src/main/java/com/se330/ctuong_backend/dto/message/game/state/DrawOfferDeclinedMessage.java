package com.se330.ctuong_backend.dto.message.game.state;

import com.se330.ctuong_backend.dto.message.BoardState;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = false)
@Data
public class DrawOfferDeclinedMessage extends GameMessage<DrawOfferDeclinedData> {
    protected BoardState type = BoardState.DrawOfferDeclined;
    private DrawOfferDeclinedData data;
    public DrawOfferDeclinedMessage(DrawOfferDeclinedData data) {
        this.data = data;
    }
}
