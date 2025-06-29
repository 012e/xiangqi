package com.se330.ctuong_backend.dto.message.invitation;

import com.se330.ctuong_backend.dto.UserDto;
import com.se330.ctuong_backend.dto.rest.GameTypeResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvitationAcceptedMessage {
    private static final String TYPE = "accepted";

    private Long id;
    private GameTypeResponse gameType;
    private UserDto inviter;
    private UserDto recipient;
    private Timestamp createdAt;
    private Timestamp expiresAt;
    private String message;
    private Long gameId;
}
