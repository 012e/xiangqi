package com.se330.ctuong_backend.dto.message.game.state;

import com.se330.ctuong_backend.dto.message.BoardState;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = false)
@Data
public class DrawOfferMessage extends GameMessage<DrawOfferData> {
    protected BoardState type = BoardState.DrawOffer;
    private DrawOfferData data;

    public DrawOfferMessage(DrawOfferData data) {
        this.data = data;
    }
}
