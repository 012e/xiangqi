package com.se330.ctuong_backend.dto.rest;

import com.se330.xiangqi.Xiangqi;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class    GameResponse {
    private String id;
    private String uciFen;;
    private User whitePlayer;
    private User blackPlayer;

    private Float whitePlayerRating;
    private Float blackPlayerRating;

    private Float whiteEloChange;
    private Float blackEloChange;

    private Timestamp startTime;
    private Instant endTime;

    @NotNull
    private Long blackTimeLeft;

    @NotNull
    private Long whiteTimeLeft;

    private String result;
    private String resultDetail;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class User {
        private Long id;
        private String sub;
        private String email;
        private String name;
        private String username;
        private String picture;
    }
}
