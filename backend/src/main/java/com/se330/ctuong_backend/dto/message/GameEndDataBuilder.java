package com.se330.ctuong_backend.dto.message;

public class GameEndDataBuilder {
    public WhiteWinBuilder whiteWin() {
        return new WhiteWinBuilder();
    }

    public BlackWinBuilder blackWin() {
        return new BlackWinBuilder();
    }

    public DrawBuilder draw() {
        return new DrawBuilder();
    }

    public static class WhiteWinBuilder {
        public GameEndData byResignation() {
            return new GameEndData("white_win", "black_resign");
        }

        public GameEndData byTimeout() {
            return new GameEndData("white_win", "black_timeout");
        }

        public GameEndData byCheckmate() {
            return new GameEndData("white_win", "black_checkmate");
        }
    }

    public static class BlackWinBuilder {
        public GameEndData byResignation() {
            return new GameEndData("black_win", "white_resign");
        }

        public GameEndData byTimeout() {
            return new GameEndData("black_win", "white_timeout");
        }

        public GameEndData byCheckmate() {
            return new GameEndData("black_win", "white_checkmate");
        }
    }

    public static class DrawBuilder {
        public GameEndData byStalemate() {
            return new GameEndData("draw", "stalemate");
        }

        public GameEndData byInsufficientMaterial() {
            return new GameEndData("draw", "insufficient_material");
        }

        public GameEndData byFiftyMoveRule() {
            return new GameEndData("draw", "fifty_move_rule");
        }

        public GameEndData byAgreement() {
            return new GameEndData("draw", "mutual_agreement");
        }
    }
}
