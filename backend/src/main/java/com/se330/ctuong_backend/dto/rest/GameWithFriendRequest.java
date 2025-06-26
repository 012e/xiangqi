package com.se330.ctuong_backend.dto.rest;

import lombok.Data;

@Data
public class GameWithFriendRequest {
    private Long friendId;
    private Long gameTypeId;
}
