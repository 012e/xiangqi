package com.se330.ctuong_backend.controller;

import com.se330.ctuong_backend.dto.rest.GameResponse;
import com.se330.ctuong_backend.model.Game;
import com.se330.ctuong_backend.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController("/game")
@RequiredArgsConstructor
public class GameController {
    private final GameRepository gameRepository;
    private final ModelMapper modelMapper;


    @GetMapping("/game/{id}")
    private ResponseEntity<GameResponse> getGame(@PathVariable String id) {
        final var game = gameRepository.getGameById(id);
        if (game == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(modelMapper.map(game, GameResponse.class));

    }
}
