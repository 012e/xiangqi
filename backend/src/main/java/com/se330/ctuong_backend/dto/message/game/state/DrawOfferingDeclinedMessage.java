package com.se330.ctuong_backend.dto.message.game.state;

import com.se330.ctuong_backend.dto.message.BoardState;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = false)
@Data
public class DrawOfferingDeclinedMessage extends GameMessage<DrawOfferingDeclinedData> {
    protected BoardState type = BoardState.DrawOfferingDeclined;
    private DrawOfferingDeclinedData data;
}
