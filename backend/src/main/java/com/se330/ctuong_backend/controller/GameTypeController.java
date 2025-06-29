package com.se330.ctuong_backend.controller;

import com.se330.ctuong_backend.dto.rest.GameTypeResponse;
import com.se330.ctuong_backend.model.GameTypeRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class GameTypeController {
    public final GameTypeRepository gameTypeRepository;
    public final ModelMapper mapper;

    @GetMapping("/game-types/")
    public List<GameTypeResponse> get() {
        final var gameTypes = gameTypeRepository.findAll();
        return gameTypes
                .stream()
                .map(t -> mapper.map(t, GameTypeResponse.class))
                .collect(Collectors.toList());
    }

    @GetMapping("/game-types/{id}")
    public GameTypeResponse getGameTypeById(@PathVariable Long id) {
        final var gameType = gameTypeRepository.findById(id);

        if (gameType.isEmpty()) {
            throw new IllegalArgumentException("Game type not found");
        }

        return mapper.map(gameType.get(), GameTypeResponse.class);
    }
}
