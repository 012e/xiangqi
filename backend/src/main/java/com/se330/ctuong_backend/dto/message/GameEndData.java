package com.se330.ctuong_backend.dto.message;

import lombok.Getter;

@Getter
public class GameEndData {
    private final String status;
    private final String reason;

    public GameEndData(String status, String reason) {
        this.status = status;
        this.reason = reason;
    }

    public static GameEndDataBuilder builder() {
        return new GameEndDataBuilder();
    }
}
