package com.se330.ctuong_backend.dto.message.game.state;

import lombok.Data;

@Data
public class GameResult {
    private final String result;
    private final String detail;

    public GameResult(String result, String detail) {
        this.result = result;
        if (!result.equals("draw") && !result.equals("white_win") && !result.equals("black_win")) {
            throw new IllegalArgumentException("Invalid game result: " + result);
        }

        // TODO: validate
        this.detail = detail;
    }

    public static GameResultBuilder builder() {
        return new GameResultBuilder();
    }
}
