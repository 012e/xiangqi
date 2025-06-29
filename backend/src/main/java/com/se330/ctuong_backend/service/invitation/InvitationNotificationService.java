package com.se330.ctuong_backend.service.invitation;

import com.se330.ctuong_backend.dto.InvitationDto;
import com.se330.ctuong_backend.dto.UserDto;
import com.se330.ctuong_backend.dto.message.invitation.InvitationAcceptedMessage;
import com.se330.ctuong_backend.dto.message.invitation.InvitationDeclinedMessage;
import com.se330.ctuong_backend.dto.rest.GameTypeResponse;
import com.se330.ctuong_backend.repository.InvitationRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InvitationNotificationService {
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final InvitationRepository invitationRepository;
    private final ModelMapper modelMapper;

    private String getDestination(String userSub) {
        return "/topic/invitation/" + userSub;
    }

    public void notifyNewInvitation(Long id) {
        final var inv = invitationRepository
                .findById(id)
                .orElseThrow(() -> new IllegalStateException("Invitation not found"));

        final var dto = modelMapper.map(inv, InvitationDto.class);

        simpMessagingTemplate.convertAndSend(getDestination(inv.getRecipient().getSub()), dto);
    }

    // No goddamn authorization :)
    public void notifyAccepted(Long invitationId) {
        final var inv = invitationRepository
                .findById(invitationId)
                .orElseThrow(() -> new IllegalStateException("Invitation not found"));
        assert inv.getIsAccepted();
        final var recipient = inv.getRecipient();
        final var inviter = inv.getInviter();

        final var dto = InvitationAcceptedMessage.builder()
                .id(invitationId)
                .message(inv.getMessage())
                .inviter(modelMapper.map(inviter, UserDto.class))
                .recipient(modelMapper.map(recipient, UserDto.class))
                .gameType(modelMapper.map(inv.getGameType(), GameTypeResponse.class))
                .gameId(inv.getGameId())
                .createdAt(inv.getCreatedAt())
                .expiresAt(inv.getExpiresAt())
                .build();

        simpMessagingTemplate.convertAndSend(getDestination(inviter.getSub()), dto);
        simpMessagingTemplate.convertAndSend(getDestination(recipient.getSub()), dto);
    }

    public void notifyDeclined(Long invitationId) {
        final var inv = invitationRepository
                .findById(invitationId)
                .orElseThrow(() -> new IllegalStateException("Invitation not found"));
        assert inv.getIsDeclined();

        final var inviter = inv.getInviter();

        final var dto = InvitationDeclinedMessage.builder()
                .build();

        simpMessagingTemplate.convertAndSend(getDestination(inviter.getSub()), dto);
    }
}
