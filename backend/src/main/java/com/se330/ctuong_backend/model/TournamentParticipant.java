package com.se330.ctuong_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.io.Serializable;

@Entity
@Table(name = "TournamentParticipants")
@IdClass(TournamentParticipantId.class)
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TournamentParticipant implements Serializable {
    @Id
    @Column(name = "tournament_id")
    private Integer tournamentId;

    @Id
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "initial_seed")
    private Integer initialSeed;

    @Column(name = "current_score", precision = 5, scale = 2)
    private BigDecimal currentScore;

    @Column(name = "current_standing")
    private Integer currentStanding;
}


