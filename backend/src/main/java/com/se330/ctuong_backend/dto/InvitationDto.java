package com.se330.ctuong_backend.dto;

import com.se330.ctuong_backend.dto.rest.GameTypeResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InvitationDto {
    private Long id;
    private GameTypeResponse gameType;
    private UserDto inviter;
    private UserDto recipient;
    private Timestamp createdAt;
    private Boolean isDeclined;
    private Boolean isAccepted;
    private Timestamp expiresAt;
    private String message;
    private Long gameId;
}
