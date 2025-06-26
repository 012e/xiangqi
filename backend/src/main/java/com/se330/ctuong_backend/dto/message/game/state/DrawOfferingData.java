package com.se330.ctuong_backend.dto.message.game.state;

import lombok.*;

@EqualsAndHashCode(callSuper = false)
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DrawOfferingData extends MessageData {
    private boolean isWhiteOfferingDraw;
    private boolean isBlackOfferingDraw;
}
