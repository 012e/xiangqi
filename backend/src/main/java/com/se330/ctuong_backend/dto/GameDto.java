package com.se330.ctuong_backend.dto;

import com.se330.ctuong_backend.model.GameType;
import com.se330.ctuong_backend.model.Tournament;
import com.se330.ctuong_backend.model.User;
import com.se330.xiangqi.Xiangqi;
import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GameDto {
    private String id;
    private GameType gameType;
    private User whitePlayer;
    private User blackPlayer;
    private Float whitePlayerRating;
    private Float blackPlayerRating;
    private Float whiteEloChange;
    private Float blackEloChange;
    private Timestamp startTime = new Timestamp(System.currentTimeMillis());
    private String uciFen = Xiangqi.INITIAL_UCI_FEN;
    private Timestamp endTime;
    private String result;
    private Tournament tournament;
    private Boolean isRated = true;
    private Boolean isStarted = false;
    private Integer botStrength;
}
