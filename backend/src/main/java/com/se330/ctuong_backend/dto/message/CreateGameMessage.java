package com.se330.ctuong_backend.dto.message;


import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.Data;

@Data
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = CreateNormalGameMessage.class, name = "normal"),
        @JsonSubTypes.Type(value = CreateGameWithBotMessage.class, name = "bot")
})
public abstract class CreateGameMessage {
    private Long gameTypeId;
}
