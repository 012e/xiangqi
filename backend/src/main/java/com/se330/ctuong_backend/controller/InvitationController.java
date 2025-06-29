package com.se330.ctuong_backend.controller;

import com.se330.ctuong_backend.dto.rest.InvitationDto;
import com.se330.ctuong_backend.service.InvitationService;
import com.se330.ctuong_backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/invitation")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
@Validated
public class InvitationController {
    private final InvitationService invitationService;
    private final UserService userService;

    @PostMapping("/send/{recipientId}/{gameTypeId}")
    @Operation(summary = "Send a game invitation")
    @ApiResponse(responseCode = "201", description = "Invitation sent successfully",
            content = @Content(schema = @Schema(implementation = InvitationDto.class)))
    @ApiResponse(responseCode = "404", description = "User not found",
            content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    @ApiResponse(responseCode = "400", description = "Invalid request",
            content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    public ResponseEntity<?> sendInvitation(
            @NotNull Principal principal,
            @PathVariable("recipientId") Long recipientId,
            @PathVariable("gameTypeId") Long gameTypeId,
            @RequestParam(required = false) String message) {
        var currentUser = userService.getUserBySub(principal.getName());
        if (currentUser.isEmpty()) {
            final var detail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, "User not found");
            detail.setTitle("User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(detail);
        }

        try {
            InvitationDto invitation = invitationService.sendInvitation(
                    currentUser.get().getId(), recipientId, gameTypeId, message);
            return ResponseEntity.status(HttpStatus.CREATED).body(invitation);
        } catch (IllegalArgumentException | IllegalStateException e) {
            final var detail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, e.getMessage());
            detail.setTitle("Invalid request");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(detail);
        }
    }

    @PostMapping("/accept/{invitationId}")
    @Operation(summary = "Accept a game invitation")
    @ApiResponse(responseCode = "200", description = "Invitation accepted successfully",
            content = @Content(schema = @Schema(implementation = InvitationDto.class)))
    @ApiResponse(responseCode = "404", description = "User or invitation not found",
            content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    @ApiResponse(responseCode = "400", description = "Invalid request",
            content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    public ResponseEntity<?> acceptInvitation(@NotNull Principal principal, @PathVariable Long invitationId) {
        var currentUser = userService.getUserBySub(principal.getName());
        if (currentUser.isEmpty()) {
            final var detail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, "User not found");
            detail.setTitle("User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(detail);
        }

        try {
            InvitationDto invitation = invitationService.acceptInvitation(invitationId, currentUser.get().getId());
            return ResponseEntity.ok(invitation);
        } catch (IllegalArgumentException e) {
            final var detail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
            detail.setTitle("Not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(detail);
        } catch (IllegalStateException e) {
            final var detail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, e.getMessage());
            detail.setTitle("Invalid request");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(detail);
        }
    }

    @PostMapping("/decline/{invitationId}")
    @Operation(summary = "Decline a game invitation")
    @ApiResponse(responseCode = "204", description = "Invitation declined successfully")
    @ApiResponse(responseCode = "404", description = "User or invitation not found",
            content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    @ApiResponse(responseCode = "400", description = "Invalid request",
            content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    public ResponseEntity<?> declineInvitation(@NotNull Principal principal, @PathVariable Long invitationId) {
        var currentUser = userService.getUserBySub(principal.getName());
        if (currentUser.isEmpty()) {
            final var detail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, "User not found");
            detail.setTitle("User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(detail);
        }

        try {
            invitationService.declineInvitation(invitationId, currentUser.get().getId());
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            final var detail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
            detail.setTitle("Not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(detail);
        } catch (IllegalStateException e) {
            final var detail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, e.getMessage());
            detail.setTitle("Invalid request");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(detail);
        }
    }

    @DeleteMapping("/{invitationId}")
    @Operation(summary = "Cancel a game invitation")
    @ApiResponse(responseCode = "204", description = "Invitation cancelled successfully")
    @ApiResponse(responseCode = "404", description = "User or invitation not found",
            content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    @ApiResponse(responseCode = "400", description = "Invalid request",
            content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    public ResponseEntity<?> cancelInvitation(@NotNull Principal principal, @PathVariable Long invitationId) {
        var currentUser = userService.getUserBySub(principal.getName());
        if (currentUser.isEmpty()) {
            final var detail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, "User not found");
            detail.setTitle("User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(detail);
        }

        try {
            invitationService.cancelInvitation(invitationId, currentUser.get().getId());
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            final var detail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
            detail.setTitle("Not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(detail);
        } catch (IllegalStateException e) {
            final var detail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, e.getMessage());
            detail.setTitle("Invalid request");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(detail);
        }
    }

    @GetMapping("/received")
    @Operation(summary = "Get pending invitations received")
    @ApiResponse(responseCode = "200", description = "Pending invitations retrieved successfully",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = InvitationDto.class))))
    @ApiResponse(responseCode = "404", description = "User not found",
            content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    public ResponseEntity<?> getPendingInvitations(@NotNull Principal principal) {
        var currentUser = userService.getUserBySub(principal.getName());
        if (currentUser.isEmpty()) {
            final var detail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, "User not found");
            detail.setTitle("User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(detail);
        }

        List<InvitationDto> invitations = invitationService.getPendingInvitationsForUser(currentUser.get().getId());
        return ResponseEntity.ok(invitations);
    }

    @GetMapping("/sent")
    @Operation(summary = "Get sent invitations")
    @ApiResponse(responseCode = "200", description = "Sent invitations retrieved successfully",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = InvitationDto.class))))
    @ApiResponse(responseCode = "404", description = "User not found",
            content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    public ResponseEntity<?> getSentInvitations(@NotNull Principal principal) {
        var currentUser = userService.getUserBySub(principal.getName());
        if (currentUser.isEmpty()) {
            final var detail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, "User not found");
            detail.setTitle("User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(detail);
        }

        List<InvitationDto> invitations = invitationService.getSentInvitationsByUser(currentUser.get().getId());
        return ResponseEntity.ok(invitations);
    }

    @GetMapping("/by-game/{gameId}")
    @Operation(summary = "Get invitation by game ID")
    @ApiResponse(responseCode = "200", description = "Invitation found",
            content = @Content(schema = @Schema(implementation = InvitationDto.class)))
    @ApiResponse(responseCode = "404", description = "Invitation not found",
            content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    public ResponseEntity<?> getInvitationByGameId(@PathVariable Long gameId) {
        var invitation = invitationService.getInvitationByGameId(gameId);
        if (invitation.isPresent()) {
            return ResponseEntity.ok(invitation.get());
        } else {
            final var detail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, "Invitation not found for this game");
            detail.setTitle("Not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(detail);
        }
    }

    @GetMapping("/{invitationId}")
    @Operation(summary = "Get invitation by ID")
    @ApiResponse(responseCode = "200", description = "Invitation found",
            content = @Content(schema = @Schema(implementation = InvitationDto.class)))
    @ApiResponse(responseCode = "404", description = "User or invitation not found",
            content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    @ApiResponse(responseCode = "400", description = "Invalid request",
            content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    public ResponseEntity<?> getInvitationById(@NotNull Principal principal, @PathVariable Long invitationId) {
        var currentUser = userService.getUserBySub(principal.getName());
        if (currentUser.isEmpty()) {
            final var detail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, "User not found");
            detail.setTitle("User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(detail);
        }

        try {
            var invitation = invitationService.getInvitationById(invitationId, currentUser.get().getId());
            if (invitation.isPresent()) {
                return ResponseEntity.ok(invitation.get());
            } else {
                final var detail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, "Invitation not found");
                detail.setTitle("Not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(detail);
            }
        } catch (IllegalArgumentException e) {
            final var detail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, e.getMessage());
            detail.setTitle("Invalid request");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(detail);
        }
    }
}
