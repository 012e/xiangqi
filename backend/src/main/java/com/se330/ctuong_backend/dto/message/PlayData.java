package com.se330.ctuong_backend.dto.message;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.Duration;

@Data
@Builder
@AllArgsConstructor
public class PlayData {
    private String from;
    private String to;
    private String player;
    private String fen;
    private String uciFen;
    private Duration blackTime;
    private Duration whiteTime;
}
