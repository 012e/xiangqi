package com.se330.ctuong_backend.dto.message;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = false)
@Data
public class CreateGameWithBotMessage extends CreateGameMessage {
    private final Integer strength;
}
