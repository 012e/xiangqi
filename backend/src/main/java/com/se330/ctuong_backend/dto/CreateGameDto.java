package com.se330.ctuong_backend.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateGameDto {
    @NotEmpty
    private Long whiteId;

    @NotEmpty
    private Long blackId;

    @NotNull
    private Long gameTypeId;

    // WARN: WILL NEED REFACTORING
    private Integer botStrength;
}
