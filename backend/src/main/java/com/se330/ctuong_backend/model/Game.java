package com.se330.ctuong_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Entity
@Table(name = "games")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "game_type_id")
    private GameType gameType;

    @ManyToOne
    @JoinColumn(name = "white_player_id", nullable = false)
    private User whitePlayer;

    @ManyToOne
    @JoinColumn(name = "black_player_id", nullable = false)
    private User blackPlayer;

    @Column(name = "white_player_rating", nullable = false)
    private Float whitePlayerRating;

    @Column(name = "black_player_rating", nullable = false)
    private Float blackPlayerRating;

    @Column(name = "white_elo_change")
    private Float whiteEloChange;

    @Column(name = "black_elo_change")
    private Float blackEloChange;

    @Column(name = "start_time")
    private Timestamp startTime = new Timestamp(System.currentTimeMillis());

    @Column(name = "end_time")
    private Timestamp endTime;

    @Column(name = "result", length = 20)
    private String result;

    @ManyToOne
    @JoinColumn(name = "winner_id")
    private User winner;

    @ManyToOne
    @JoinColumn(name = "tournament_id")
    private Tournament tournament;

    @Column(name = "is_rated")
    private Boolean isRated = true;
}
