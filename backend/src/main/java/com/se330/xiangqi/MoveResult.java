package com.se330.xiangqi;

import lombok.Data;

import java.util.Optional;

@Data
public class MoveResult {
    private boolean ok = true;
    private Optional<String> message;

    private MoveResult(boolean ok, String message) {
        this.ok = ok;
        this.message = Optional.of(message);
    }

    private MoveResult(boolean ok) {
        this.ok = ok;
        this.message = Optional.empty();
    }

    public static MoveResult ok() {
        return new MoveResult(true);
    }

    public static MoveResult fail(String message) {
        return new MoveResult(false, message);
    }

    public boolean isOk() {
        return ok;
    }

    public Optional<String> getMessage() {
        return message;
    }
}
