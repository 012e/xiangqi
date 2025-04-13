package com.se330.ctuong_backend.dto.message;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class PlayData {
    private String from;
    private String to;
    private String player;
    private String fen;
    private String uciFen;
}
