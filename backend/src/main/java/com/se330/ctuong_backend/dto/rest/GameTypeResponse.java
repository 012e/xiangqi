package com.se330.ctuong_backend.dto.rest;

import lombok.Data;

@Data
public class GameTypeResponse {
    private Long id;
    private String typeName;
    private Long timeControl;
}
