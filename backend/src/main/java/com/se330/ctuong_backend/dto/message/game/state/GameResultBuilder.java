package com.se330.ctuong_backend.dto.message.game.state;

public class GameResultBuilder {
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
        public GameResult byResignation() {
            return new GameResult("white_win", "black_resign");
        }

        public GameResult byTimeout() {
            return new GameResult("white_win", "black_timeout");
        }

        public GameResult byCheckmate() {
            return new GameResult("white_win", "black_checkmate");
        }
    }

    public static class BlackWinBuilder {
        public GameResult byResignation() {
            return new GameResult("black_win", "white_resign");
        }

        public GameResult byTimeout() {
            return new GameResult("black_win", "white_timeout");
        }

        public GameResult byCheckmate() {
            return new GameResult("black_win", "white_checkmate");
        }
    }

    public static class DrawBuilder {
        public GameResult byStalemate() {
            return new GameResult("draw", "stalemate");
        }

        public GameResult byInsufficientMaterial() {
            return new GameResult("draw", "insufficient_material");
        }

        public GameResult byFiftyMoveRule() {
            return new GameResult("draw", "fifty_move_rule");
        }

        public GameResult byAgreement() {
            return new GameResult("draw", "mutual_agreement");
        }
    }
}
