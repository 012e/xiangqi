package com.se330.ctuong_backend.controller;

import com.se330.ctuong_backend.dto.rest.UserDto;
import com.se330.ctuong_backend.service.FriendService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('SCOPE_read:user')")
public class FriendController {
    
    private final FriendService friendService;

    @PostMapping("/request/{friendId}")
    @Operation(summary = "Send a friend request")
    @ApiResponse(responseCode = "200", description = "Friend request sent successfully")
    public ResponseEntity<Void> sendFriendRequest(@RequestParam Long userId, @PathVariable Long friendId) {
        friendService.makeFriend(userId, friendId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/accept/{friendId}")
    @Operation(summary = "Accept a friend request")
    @ApiResponse(responseCode = "200", description = "Friend request accepted successfully")
    public ResponseEntity<Void> acceptFriendRequest(@RequestParam Long userId, @PathVariable Long friendId) {
        friendService.acceptFriendRequest(userId, friendId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reject/{friendId}")
    @Operation(summary = "Reject a friend request")
    @ApiResponse(responseCode = "200", description = "Friend request rejected successfully")
    public ResponseEntity<Void> rejectFriendRequest(@RequestParam Long userId, @PathVariable Long friendId) {
        friendService.rejectFriendRequest(userId, friendId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{friendId}")
    @Operation(summary = "Remove a friend")
    @ApiResponse(responseCode = "200", description = "Friend removed successfully")
    public ResponseEntity<Void> removeFriend(@RequestParam Long userId, @PathVariable Long friendId) {
        friendService.removeFriend(userId, friendId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    @Operation(summary = "Get list of friends")
    @ApiResponse(responseCode = "200", description = "Friends list retrieved successfully")
    public ResponseEntity<List<UserDto>> getFriends(@RequestParam Long userId) {
        List<UserDto> friends = friendService.getFriendList(userId);
        return ResponseEntity.ok(friends);
    }

    @GetMapping("/requests/pending")
    @Operation(summary = "Get pending friend requests received")
    @ApiResponse(responseCode = "200", description = "Pending friend requests retrieved successfully")
    public ResponseEntity<List<UserDto>> getPendingRequests(@RequestParam Long userId) {
        List<UserDto> pendingRequests = friendService.getPendingFriendRequests(userId);
        return ResponseEntity.ok(pendingRequests);
    }

    @GetMapping("/requests/sent")
    @Operation(summary = "Get sent friend requests")
    @ApiResponse(responseCode = "200", description = "Sent friend requests retrieved successfully")
    public ResponseEntity<List<UserDto>> getSentRequests(@RequestParam Long userId) {
        List<UserDto> sentRequests = friendService.getSentFriendRequests(userId);
        return ResponseEntity.ok(sentRequests);
    }
}
