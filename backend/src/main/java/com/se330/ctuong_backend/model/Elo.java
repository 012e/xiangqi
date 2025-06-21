package com.se330.ctuong_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.sql.Timestamp;

@Entity
@Table(name = "elo")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Elo {
    @Embeddable
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Pk implements Serializable {
        private Long userId;
        private Long gameTypeId;
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
    private Double currentElo = 1500.0d;

    @Column(name = "last_updated")
    private Timestamp lastUpdated = new Timestamp(System.currentTimeMillis());
}
