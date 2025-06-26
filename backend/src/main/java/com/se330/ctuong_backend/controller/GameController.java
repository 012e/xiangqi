package com.se330.ctuong_backend.controller;

import com.se330.ctuong_backend.dto.rest.GameResponse;
import com.se330.ctuong_backend.dto.rest.GameWithFriendRequest;
import com.se330.ctuong_backend.service.game.GameService;
import com.se330.ctuong_backend.service.game.PlayFriendService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.quartz.SchedulerException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController("/game")
@RequiredArgsConstructor
@Tag(name = "Game", description = "Game management operations")
public class GameController {
    private final GameService gameService;
    private final PlayFriendService playFriendService;

    @GetMapping("/game/{id}")
    @Operation(summary = "Get game by ID", description = "Retrieves a specific game by its unique identifier")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Game found and returned successfully"),
            @ApiResponse(responseCode = "404", description = "Game not found")
    })
    private ResponseEntity<GameResponse> getGame(
            @Parameter(description = "Game ID", required = true) @PathVariable String id) throws SchedulerException {
        final var game = gameService.getGameById(id);
        return game.map(ResponseEntity::ok).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/game/{id}/resign")
    @Operation(summary = "Resign from game", description = "Allows a player to resign from the specified game")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Player resigned successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "404", description = "Game not found")
    })
    private ResponseEntity<Object> resign(
            @Parameter(description = "Game ID", required = true) @PathVariable String id,
            Principal principal) throws SchedulerException {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        gameService.resign(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/game/play-friend")
    @Operation(summary = "Create game with friend", description = "Creates a new game between the authenticated user and a friend")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Game created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "401", description = "User not authenticated")
    })
    private ResponseEntity<Object> playFriend(
            @Parameter(description = "Game creation request containing friend ID and game type") @RequestBody GameWithFriendRequest request,
            Principal principal
    ) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        final var gameResponse = playFriendService.createGame(
                principal.getName(),
                request.getFriendId(),
                request.getGameTypeId()
        );
        return ResponseEntity.ok(gameResponse);
    }
}