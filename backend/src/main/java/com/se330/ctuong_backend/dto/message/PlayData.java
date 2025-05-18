package com.se330.ctuong_backend.dto.message;

import com.se330.ctuong_backend.dto.message.game.state.MessageData;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.Duration;

@Data
@Builder
@AllArgsConstructor
public class PlayData extends MessageData {
    private String from;
    private String to;
    private String player;
    private String fen;
    private String uciFen;
    private Long blackTime;
    private Long whiteTime;
}
