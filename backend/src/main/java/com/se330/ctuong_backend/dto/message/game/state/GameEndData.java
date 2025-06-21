package com.se330.ctuong_backend.dto.message.game.state;

import lombok.Builder;
import lombok.Data;

import java.io.Serializable;

@Data
@Builder
public class GameEndData extends MessageData {
    private final GameResult result;
    private final Long whiteEloChange;
    private final Long blackEloChange;
}
