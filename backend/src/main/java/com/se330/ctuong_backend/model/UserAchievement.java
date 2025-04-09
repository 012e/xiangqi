package com.se330.ctuong_backend.model;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Entity
@Table(name = "user_achievements")
public class UserAchievement {
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class Id implements java.io.Serializable {
        private Integer userId;
        private Integer achievementId;
    }

    @EmbeddedId
    private Id id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @ManyToOne
    @MapsId("achievementId")
    @JoinColumn(name = "achievement_id", referencedColumnName = "id")
    private Achievement achievement;

    @Column(name = "earned_at")
    private Timestamp earnedAt = new Timestamp(System.currentTimeMillis());
}
