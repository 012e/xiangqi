package com.se330.ctuong_backend.model;

import com.se330.ctuong_backend.config.Jpa;
import com.se330.xiangqi.Xiangqi;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.Duration;
import java.time.Instant;

@Entity
@Table(name = "games")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Game {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.UUID)
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
    private Instant endTime;

    @Column(name = "white_counter_start")
    private Instant whiteCounterStart;

    @Column(name = "black_counter_start")
    private Instant blackCounterStart;

    @Column(name = "black_time_left", nullable = false, columnDefinition = "bigint")
    @Convert(converter = Jpa.DurationToLongConverter.class)
    private Duration blackTimeLeft;

    @Column(name = "white_time_left", nullable = false, columnDefinition = "bigint")
    @Convert(converter = Jpa.DurationToLongConverter.class)
    private Duration whiteTimeLeft;

    @Column(name = "result", length = 20)
    private String result;

    @Column(name = "result_detail")
    private String resultDetail;

    @ManyToOne
    @JoinColumn(name = "tournament_id")
    private Tournament tournament;

    @Column(name = "is_rated")
    private Boolean isRated = true;

    @Column(name = "is_started")
    private Boolean isStarted = false;

    @Column(name = "is_ended")
    private Boolean isEnded = false;

    @Transient
    public Boolean getGameEnded() {
        return getEndTime() != null;
    }

    @Transient
    public void updateWhiteTime() {
        final var whiteTime = getWhiteTimeLeft();
        final var now = Instant.now();

        final var whiteCounterStart = getWhiteCounterStart();
        if (whiteCounterStart == null) {
            return;
        }


        final var moveTime = Duration.between(whiteCounterStart, now);
        if (moveTime.isNegative()) {
            throw new IllegalStateException("Move time cannot be negative");
        }
        setWhiteTimeLeft(whiteTime.minus(moveTime));
    }

    @Transient
    public void updateBlackTime() {
        final var blackTime = getBlackTimeLeft();
        final var now = Instant.now();

        final var blackCounterStart = getBlackCounterStart();
        if (blackCounterStart == null) {
            return;
        }

        final var moveTime = Duration.between(blackCounterStart, now);
        if (moveTime.isNegative()) {
            throw new IllegalStateException("Move time cannot be negative");
        }
        setBlackTimeLeft(blackTime.minus(moveTime));
    }

    @Transient
    public void beginBlackCounter() {
        setBlackCounterStart(Instant.now());
    }

    @Transient
    public void beginWhiteCounter() {
        setWhiteCounterStart(Instant.now());
    }
}
