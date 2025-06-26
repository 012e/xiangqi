package com.se330.ctuong_backend.controller;

import com.se330.ctuong_backend.dto.rest.GameResponse;
import com.se330.ctuong_backend.service.game.GameResignService;
import com.se330.ctuong_backend.service.game.GameService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.quartz.SchedulerException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController("/game")
@RequiredArgsConstructor
@Tag(name = "Game", description = "Game management operations")
public class GameController {
    private final GameService gameService;

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
            @ApiResponse(responseCode = "404", description = "Game not found")
    })
    private ResponseEntity<Object> resign(
            @Parameter(description = "Game ID", required = true) @PathVariable String id,
            Principal principal) throws SchedulerException {
        gameService.resign(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/game/{id}/offer-draw")
    @Operation(summary = "Offer a draw", description = "Allows a player to offer a draw in the specified game")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Player offered draw successfully"),
            @ApiResponse(responseCode = "404", description = "Game not found")
    })
    private ResponseEntity<Object> offerDraw(
            @Parameter(description = "Game ID", required = true) @PathVariable String id,
            Principal principal) throws SchedulerException {
        gameService.offerDraw(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/game/{id}/decline-draw")
    @Operation(summary = "Decline a draw", description = "Deline other player's draw offer in the specified game")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Player declined draw offer successfully"),
            @ApiResponse(responseCode = "404", description = "Game not found")
    })
    private ResponseEntity<Object> declineDraw(
            @Parameter(description = "Game ID", required = true) @PathVariable String id,
            Principal principal) throws SchedulerException {
        gameService.declineDraw(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}