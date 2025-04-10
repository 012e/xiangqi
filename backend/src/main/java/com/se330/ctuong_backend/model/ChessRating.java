package com.se330.ctuong_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.sql.Timestamp;

@Entity
@Table(name = "chess_ratings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChessRating {
    @Embeddable
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Pk implements Serializable {
        private Long userId;
        private Integer gameTypeId;
    }

    @EmbeddedId
    private Pk id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @ManyToOne
    @MapsId("gameTypeId")
    @JoinColumn(name = "game_type_id", referencedColumnName = "id")
    private GameType gameType;

    @Column(name = "current_elo")
    private Integer currentElo = 1500;

    @Column(name = "highest_elo")
    private Integer highestElo = 1500;

    @Column(name = "last_updated")
    private Timestamp lastUpdated = new Timestamp(System.currentTimeMillis());
}
