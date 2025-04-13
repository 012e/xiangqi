package com.se330.ctuong_backend.dto.message;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum BoardState {
    Play,
    Error,
    GameEnd;

    @JsonValue
    public String toJson() {
        return "State." + this.name();
    }

    @JsonCreator
    public static BoardState fromJson(String value) {
        return BoardState.valueOf(value.replace("State.", ""));
    }
}
