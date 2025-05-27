package com.se330.ctuong_backend.controller;

import com.se330.ctuong_backend.dto.rest.UserDto;
import com.se330.ctuong_backend.service.FriendService;
import com.se330.ctuong_backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/friend")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class FriendController {
    private final FriendService friendService;
    private final UserService userService;

    @PostMapping("/request/{friendId}")
    @Operation(summary = "Send a friend request")
    @ApiResponse(responseCode = "204", description = "Friend request sent successfully")
    public ResponseEntity<?> sendFriendRequest(@NotNull Principal principal, @PathVariable Long friendId) {
        var currentUser = userService.getUserBySub(principal.getName());
        if (currentUser.isEmpty()) {
            final var detail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, "User not found");
            detail.setTitle("User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(detail);
        }

        friendService.makeFriend(currentUser.get().getId(), friendId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/accept/{friendId}")
    @Operation(summary = "Accept a friend request")
    @ApiResponse(responseCode = "204", description = "Friend request accepted successfully")
    @ApiResponse(responseCode = "404", description = "User not found")
    public ResponseEntity<?> acceptFriendRequest(@NotNull Principal principal, @PathVariable Long friendId) {
        var currentUser = userService.getUserBySub(principal.getName());
        if (currentUser.isEmpty()) {
            final var detail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, "User not found");
            detail.setTitle("User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(detail);
        }

        friendService.acceptFriendRequest(currentUser.get().getId(), friendId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/reject/{friendId}")
    @Operation(summary = "Reject a friend request")
    @ApiResponse(responseCode = "204", description = "Friend request rejected successfully")
    public ResponseEntity<?> rejectFriendRequest(@NotNull Principal principal, @PathVariable Long friendId) {
        var currentUser = userService.getUserBySub(principal.getName());
        if (currentUser.isEmpty()) {
            final var detail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, "User not found");
            detail.setTitle("User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(detail);
        }

        friendService.rejectFriendRequest(currentUser.get().getId(), friendId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{friendId}")
    @Operation(summary = "Remove a friend")
    @ApiResponse(responseCode = "204", description = "Friend removed successfully")
    public ResponseEntity<?> removeFriend(@NotNull Principal principal, @PathVariable Long friendId) {
        var currentUser = userService.getUserBySub(principal.getName());
        if (currentUser.isEmpty()) {
            final var detail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, "User not found");
            detail.setTitle("User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(detail);
        }

        friendService.removeFriend(currentUser.get().getId(), friendId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Operation(summary = "Get list of friends")
    @ApiResponse(responseCode = "200", description = "Friends list retrieved successfully")
    public ResponseEntity<?> getFriends(@NotNull Principal principal) {
        var currentUser = userService.getUserBySub(principal.getName());
        if (currentUser.isEmpty()) {
            final var detail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, "User not found");
            detail.setTitle("User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(detail);
        }

        List<UserDto> friends = friendService.getFriendList(currentUser.get().getId());
        return ResponseEntity.ok(friends);
    }

    @GetMapping("/requests/pending")
    @Operation(summary = "Get pending friend requests received")
    @ApiResponse(responseCode = "200", description = "Pending friend requests retrieved successfully")
    public ResponseEntity<?> getPendingRequests(@NotNull Principal principal) {
        var currentUser = userService.getUserBySub(principal.getName());
        if (currentUser.isEmpty()) {
            final var detail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, "User not found");
            detail.setTitle("User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(detail);
        }

        List<UserDto> pendingRequests = friendService.getPendingFriendRequests(currentUser.get().getId());
        return ResponseEntity.ok(pendingRequests);
    }

    @GetMapping("/requests/sent")
    @Operation(summary = "Get sent friend requests")
    @ApiResponse(responseCode = "200", description = "Sent friend requests retrieved successfully")
    public ResponseEntity<?> getSentRequests(@NotNull Principal principal) {
        var currentUser = userService.getUserBySub(principal.getName());
        if (currentUser.isEmpty()) {
            final var detail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, "User not found");
            detail.setTitle("User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(detail);
        }

        List<UserDto> sentRequests = friendService.getSentFriendRequests(currentUser.get().getId());
        return ResponseEntity.ok(sentRequests);
    }
}
