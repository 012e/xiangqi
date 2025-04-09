package com.se330.ctuong_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Entity
@Table(name = "tournaments")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Tournament {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tournament_id")
    private Integer tournamentId;

    @Column(name = "tournament_name", nullable = false, length = 100)
    private String tournamentName;

    @Column(name = "start_date", nullable = false)
    private Timestamp startDate;

    @Column(name = "end_date", nullable = false)
    private Timestamp endDate;

    @Column(name = "max_players")
    private Integer maxPlayers;

    @Column(name = "current_players")
    private Integer currentPlayers;

    @Column(name = "tournament_type", length = 50)
    private String tournamentType;

    @Column(name = "status", length = 20)
    private String status;
}
