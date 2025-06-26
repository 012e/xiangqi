package com.se330.ctuong_backend.service.game;

import com.se330.ctuong_backend.dto.CreateGameDto;
import com.se330.ctuong_backend.dto.rest.GameResponse;
import com.se330.ctuong_backend.model.GameTypeRepository;
import com.se330.ctuong_backend.repository.GameRepository;
import com.se330.ctuong_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class PlayFriendService {
    private final GameService gameService;
    private final UserRepository userRepository;
    private final Random random;
    private final GameTypeRepository gameTypeRepository;
    private final ModelMapper modelMapper;
    private final GameRepository gameRepository;

    public GameResponse createGame(String playerSub, Long friendId, Long gameTypeId) {
        var player = userRepository.getUserBySub(playerSub)
                .orElseThrow(() -> new IllegalArgumentException("Player not found with sub: " + playerSub));

        var friend = userRepository.findById(friendId)
                .orElseThrow(() -> new IllegalArgumentException("Friend not found with id: " + friendId));

        gameTypeRepository.findById(gameTypeId).orElseThrow(() ->
                new IllegalArgumentException("Game type not found with id: " + gameTypeId));


        var createGameDto = CreateGameDto.builder().gameTypeId(gameTypeId);

        if (random.nextBoolean()) {
            createGameDto.whiteId(player.getId());
            createGameDto.blackId(friendId);
        } else {
            createGameDto.whiteId(friendId);
            createGameDto.blackId(player.getId());
        }

        final var dto = gameService.createGame(createGameDto.build());

        return modelMapper
                .map(gameRepository
                        .findById(dto.getId())
                        .orElseThrow(() -> new IllegalStateException("Game must be created already")), GameResponse.class);
    }
}
