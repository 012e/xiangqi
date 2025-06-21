package com.se330.ctuong_backend.service.elo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UpdateEloResult {
    private final Double whiteEloChange;
    private final Double blackEloChange;
    private final Double whiteNewElo;
    private final Double blackNewElo;
}
