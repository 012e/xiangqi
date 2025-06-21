package com.se330.ctuong_backend.service.elo;

import com.se330.xiangqi.GameResult;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class EloCalculatorArgs {
    private final Player blackPlayer;
    private final Player whitePlayer;
    private final com.se330.xiangqi.GameResult result;

    private EloCalculatorArgs() {
        this.blackPlayer = null;
        this.whitePlayer = null;
        this.result = null;
    }

    public static Builder builder(){
        return new Builder();
    }

    public static class Builder {

        private Player blackPlayer;
        private Player whitePlayer;
        private GameResult result;

        public Builder black(Player player) {
            this.blackPlayer = player;
            return this;
        }

        public Builder white(Player player) {
            this.whitePlayer = player;
            return this;
        }

        public Builder result(com.se330.xiangqi.GameResult result) {
            this.result = result;
            return this;
        }

        public EloCalculatorArgs build() {
            return new EloCalculatorArgs(blackPlayer, whitePlayer, result);
        }
    }

    @Data
    @lombok.Builder
    public static class Player {
        private final double elo;
        private final Long gamePlayed;

        public Player(double elo, Long gamePlayed) {
            this.elo = elo;
            this.gamePlayed = gamePlayed;
        }
    }
}
