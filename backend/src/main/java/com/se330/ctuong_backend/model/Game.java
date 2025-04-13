package com.se330.ctuong_backend.model;

import com.se330.xiangqi.Xiangqi;
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
    @Column(name = "id")
    private String id;

    @ManyToOne
    @JoinColumn(name = "game_type_id")
    private GameType gameType;

    @ManyToOne
    @JoinColumn(name = "white_player_id")
    private User whitePlayer;

    @ManyToOne
    @JoinColumn(name = "black_player_id")
    private User blackPlayer;

    @Column(name = "white_player_rating")
    private Float whitePlayerRating;

    @Column(name = "black_player_rating")
    private Float blackPlayerRating;

    @Column(name = "white_elo_change")
    private Float whiteEloChange;

    @Column(name = "black_elo_change")
    private Float blackEloChange;

    @Column(name = "start_time")
    private Timestamp startTime = new Timestamp(System.currentTimeMillis());

    @Column(name = "uci_fen", columnDefinition = "text")
    private String uciFen = Xiangqi.INITIAL_UCI_FEN;

    @Column(name = "end_time")
    private Timestamp endTime;

    @Column(name = "result", length = 20)
    private String result;

    @ManyToOne
    @JoinColumn(name = "tournament_id")
    private Tournament tournament;

    @Column(name = "is_rated")
    private Boolean isRated = true;
}
