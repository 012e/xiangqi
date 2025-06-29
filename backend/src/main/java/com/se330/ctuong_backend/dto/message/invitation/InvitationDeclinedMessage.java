package com.se330.ctuong_backend.dto.message.invitation;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InvitationDeclinedMessage {
    private static final String TYPE = "declined";
}
