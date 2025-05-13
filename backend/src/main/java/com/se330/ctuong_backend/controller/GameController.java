package com.se330.ctuong_backend.controller;

import com.se330.ctuong_backend.dto.rest.GameResponse;
import com.se330.ctuong_backend.model.Game;
import com.se330.ctuong_backend.repository.GameRepository;
import com.se330.ctuong_backend.service.GameService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.quartz.SchedulerException;
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
    private final GameService gameService;


    @GetMapping("/game/{id}")
    private ResponseEntity<GameResponse> getGame(@PathVariable String id) throws SchedulerException {
        final var game = gameService.getGameById(id);
        return game.map(ResponseEntity::ok).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));

    }
}
