package com.se330.ctuong_backend.service.invitation;

import com.se330.ctuong_backend.dto.CreateGameDto;
import com.se330.ctuong_backend.dto.GameDto;
import com.se330.ctuong_backend.dto.InvitationDto;
import com.se330.ctuong_backend.model.Invitation;
import com.se330.ctuong_backend.repository.InvitationRepository;
import com.se330.ctuong_backend.repository.UserRepository;
import com.se330.ctuong_backend.model.GameTypeRepository;
import com.se330.ctuong_backend.service.game.GameService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class InvitationService {
    private final InvitationRepository invitationRepository;
    private final UserRepository userRepository;
    private final GameTypeRepository gameTypeRepository;
    private final InvitationNotificationService invitationNotificationService;
    private final GameService gameService;
    private final ModelMapper modelMapper;
    private final Random random;

    @Transactional
    public InvitationDto sendInvitation(Long inviterId, Long recipientId, Long gameTypeId, String message) {
        if (inviterId.equals(recipientId)) {
            throw new IllegalArgumentException("Cannot send invitation to yourself");
        }

        // Check if users exist
        var inviter = userRepository.findById(inviterId)
                .orElseThrow(() -> new IllegalArgumentException("Inviter not found"));
        var recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new IllegalArgumentException("Recipient not found"));

        // Check if game type exists
        var gameType = gameTypeRepository.findById(gameTypeId)
                .orElseThrow(() -> new IllegalArgumentException("Game type not found"));

        // Check if there's already a pending invitation between these users for this game type
        Timestamp currentTime = new Timestamp(System.currentTimeMillis());
        Optional<Invitation> existingInvitation = invitationRepository.findPendingInvitationBetweenUsers(
                inviterId, recipientId, gameTypeId, currentTime);

        if (existingInvitation.isPresent()) {
            throw new IllegalStateException("Invitation already exists between these users for this game type");
        }

        // Create new invitation
        Invitation invitation = Invitation.builder()
                .inviter(inviter)
                .recipient(recipient)
                .gameType(gameType)
                .message(message)
                .isDeclined(false)
                .isAccepted(false)
                .build();

        invitation = invitationRepository.save(invitation);
        log.info("Invitation sent from user {} to user {} for game type {}", inviterId, recipientId, gameTypeId);

        invitationNotificationService.notifyNewInvitation(invitation.getId());

        return modelMapper.map(invitation, InvitationDto.class);
    }

    @Transactional
    public InvitationDto acceptInvitation(Long invitationId, Long userId) {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new IllegalArgumentException("Invitation not found"));

        // Check if the user is the recipient
        if (!invitation.getRecipient().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only accept invitations sent to you");
        }

        // Check if invitation is still pending
        if (invitation.getIsAccepted() || invitation.getIsDeclined()) {
            throw new IllegalStateException("Invitation has already been responded to");
        }

        // Check if invitation is not expired
        Timestamp currentTime = new Timestamp(System.currentTimeMillis());
        if (invitation.getExpiresAt().before(currentTime)) {
            throw new IllegalStateException("Invitation has expired");
        }

        invitation.setIsAccepted(true);

        final var gameResponse = createGame(invitation);

        invitation.setGameId(gameResponse.getId());
        invitation = invitationRepository.save(invitation);


        log.info("Invitation {} accepted by user {}", invitationId, userId);
        invitationNotificationService.notifyAccepted(invitationId);
        return modelMapper.map(invitation, InvitationDto.class);
    }

    private GameDto createGame(Invitation invitation) {
        final var createGameBd = CreateGameDto.builder()
                .gameTypeId(invitation.getGameType().getId());

        if (random.nextBoolean()) {
            createGameBd.whiteId(invitation.getRecipient().getId())
                    .blackId(invitation.getInviter().getId());
        } else {
            createGameBd.whiteId(invitation.getInviter().getId())
                    .blackId(invitation.getRecipient().getId());
        }

        return gameService.createGame(createGameBd.build());
    }

    @Transactional
    public void declineInvitation(Long invitationId, Long userId) {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new IllegalArgumentException("Invitation not found"));

        // Check if the user is the recipient
        if (!invitation.getRecipient().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only decline invitations sent to you");
        }

        // Check if invitation is still pending
        if (invitation.getIsAccepted() || invitation.getIsDeclined()) {
            throw new IllegalStateException("Invitation has already been responded to");
        }

        invitation.setIsDeclined(true);
        invitationRepository.save(invitation);
        invitationNotificationService.notifyDeclined(invitationId);

        log.info("Invitation {} declined by user {}", invitationId, userId);
    }

    @Transactional
    public void cancelInvitation(Long invitationId, Long userId) {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new IllegalArgumentException("Invitation not found"));

        // Check if the user is the inviter
        if (!invitation.getInviter().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only cancel invitations you sent");
        }

        // Check if invitation is still pending
        if (invitation.getIsAccepted() || invitation.getIsDeclined()) {
            throw new IllegalStateException("Cannot cancel invitation that has already been responded to");
        }

        invitationRepository.delete(invitation);
        log.info("Invitation {} cancelled by user {}", invitationId, userId);
    }

    @Transactional
    public void updateInvitationWithGameId(Long invitationId, Long gameId) {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new IllegalArgumentException("Invitation not found"));

        if (!invitation.getIsAccepted()) {
            throw new IllegalStateException("Can only set game ID for accepted invitations");
        }

        invitationRepository.save(invitation);

        log.info("Invitation {} updated with game ID {}", invitationId, gameId);
    }

    public List<InvitationDto> getPendingInvitationsForUser(Long userId) {
        Timestamp currentTime = new Timestamp(System.currentTimeMillis());
        List<Invitation> invitations = invitationRepository.findPendingInvitationsForUser(userId, currentTime);

        return invitations.stream()
                .map(invitation -> modelMapper.map(invitation, InvitationDto.class))
                .collect(Collectors.toList());
    }

    public List<InvitationDto> getSentInvitationsByUser(Long userId) {
        Timestamp currentTime = new Timestamp(System.currentTimeMillis());
        List<Invitation> invitations = invitationRepository.findSentInvitationsByUser(userId, currentTime);

        return invitations.stream()
                .map(invitation -> modelMapper.map(invitation, InvitationDto.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public void cleanupExpiredInvitations() {
        Timestamp currentTime = new Timestamp(System.currentTimeMillis());
        List<Invitation> expiredInvitations = invitationRepository.findExpiredInvitations(currentTime);

        invitationRepository.deleteAll(expiredInvitations);
        log.info("Cleaned up {} expired invitations", expiredInvitations.size());
    }

    public Optional<InvitationDto> getInvitationByGameId(Long gameId) {
        Optional<Invitation> invitation = invitationRepository.findByGameId(gameId);
        return invitation.map(inv -> modelMapper.map(inv, InvitationDto.class));
    }

    public Optional<InvitationDto> getInvitationById(Long invitationId, Long userId) {
        Optional<Invitation> invitation = invitationRepository.findById(invitationId);

        if (invitation.isEmpty()) {
            return Optional.empty();
        }

        Invitation inv = invitation.get();

        // Check if the user is involved in this invitation (either as inviter or recipient)
        if (!inv.getInviter().getId().equals(userId) && !inv.getRecipient().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only view invitations you are involved in");
        }

        return Optional.of(modelMapper.map(inv, InvitationDto.class));
    }
}
