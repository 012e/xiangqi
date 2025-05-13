package com.se330.ctuong_backend.service;

import com.mchange.rmi.NotAuthorizedException;
import com.se330.ctuong_backend.dto.CreateGameDto;
import com.se330.ctuong_backend.dto.message.Game;
import com.se330.ctuong_backend.model.GameTypeRepository;
import com.se330.ctuong_backend.repository.UserRepository;
import com.se330.ctuong_backend.util.UniqueQueue;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class QueueMatchMaker implements MatchMaker {
    // TEMPORARY: only supports 3 queues (3m, 5m, 10m)
    // TODO: consider making it thread-safe
    private static final List<UniqueQueue<Long>> queues = List.of(new UniqueQueue<>(), new UniqueQueue<>(), new UniqueQueue<>());

    private final GameCreatedNotifier gameCreatedNotifier;
    private final GameService gameService;
    private final Random random;
    private final UserRepository userRepository;
    private final GameTypeRepository gameTypeRepository;

    @Scheduled(fixedDelay = 1000)
    protected void scheduleFixedDelayTask() throws NotAuthorizedException {
        for (int i = 0; i < queues.size(); ++i) {
            final var queue = queues.get(i);
            tick(queue, (long) i+1);
        }
    }

    private void tick(UniqueQueue<Long> queue, Long gameTypeId) throws NotAuthorizedException {
        if (queue.size() < 2) {
            return;
        }

        final var playerAId = queue.dequeue();
        final var playerBId = queue.dequeue();

        final var playerA = userRepository
                .findById(playerAId)
                .orElseThrow(() -> new IllegalStateException("Player not found"));

        final var playerB = userRepository
                .findById(playerBId)
                .orElseThrow(() -> new IllegalStateException("Player not found"));

        final var gameType = gameTypeRepository
                .findById(1L)
                .orElseThrow(() -> new IllegalStateException("Game type not found"));

        final var gameBuilder = CreateGameDto.builder()
                .gameTypeId(gameTypeId);

        if (random.nextBoolean()) {
            gameBuilder
                    .whiteId(playerA.getId())
                    .blackId(playerB.getId());
        } else {
            gameBuilder
                    .blackId(playerA.getId())
                    .whiteId(playerB.getId());
        }

        final var game = gameBuilder.build();
        var createdGame = gameService.createGame(game);
        log.trace("Game created: {}", createdGame);

        gameCreatedNotifier.notify(createdGame);
    }


    public void addToPlayerPool(Long userId, @Valid Game.CreateGameMessage createGameMessage) {
        log.trace("Adding user {} to queue {}", userId, createGameMessage.getGameTypeId());

        final var gameType = gameTypeRepository
                .findById(createGameMessage.getGameTypeId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid game type"));

        queues
                .get(gameType.getId().intValue() - 1)
                .enqueue(userId);
    }
}
