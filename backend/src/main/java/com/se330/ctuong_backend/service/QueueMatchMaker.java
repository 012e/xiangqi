package com.se330.ctuong_backend.service;

import com.se330.ctuong_backend.config.ApplicationConfiguration;
import com.se330.ctuong_backend.dto.CreateGameDto;
import com.se330.ctuong_backend.dto.message.CreateGameMessage;
import com.se330.ctuong_backend.dto.message.CreateGameWithBotMessage;
import com.se330.ctuong_backend.dto.message.CreateNormalGameMessage;
import com.se330.ctuong_backend.model.GameTypeRepository;
import com.se330.ctuong_backend.repository.UserRepository;
import com.se330.ctuong_backend.util.UniqueQueue;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Slf4j
public class QueueMatchMaker implements MatchMaker {
    private final GameCreatedNotifier gameCreatedNotifier;
    private final GameService gameService;
    private final Random random;
    private final UserRepository userRepository;
    private final GameTypeRepository gameTypeRepository;
    private final Map<BotGameKey, BotGame> botGameDetail = new ConcurrentHashMap<>();

    @Data
    private static class BotGameKey {
        private Long gameTypeId;
        private Long userId;

        public BotGameKey(Long gameTypeId, Long userId) {
            this.gameTypeId = gameTypeId;
            this.userId = userId;
        }
    }

    @Data
    private static class BotGame {
        private Integer botStrength;

        public BotGame(Integer botStrength) {
            this.botStrength = botStrength;
        }
    }

    // TODO: remove hard coded game type id :)
    private static final List<UniqueQueue<Long>> queues = IntStream.range(0, 6)
            .mapToObj(i -> new UniqueQueue<Long>())
            .toList();

    // TODO: remove hard coded game type id :)
    private static final List<UniqueQueue<Long>> botQueues = IntStream.range(0, 6)
            .mapToObj(i -> new UniqueQueue<Long>())
            .toList();

    @Scheduled(fixedDelay = 1000)
    protected void scheduleFixedDelayTask() {
        for (int i = 0; i < queues.size(); ++i) {
            final var queue = queues.get(i);
            tick(queue, (long) i + 1);

            final var botQueue = botQueues.get(i);
            tickBotQueue(botQueue, (long) i + 1);
        }
    }

    private void tick(UniqueQueue<Long> queue, Long gameTypeId) {
        while (queue.size() >= 2) {
            final var playerAId = queue.dequeue();
            final var playerBId = queue.dequeue();

            createGame(gameTypeId, playerAId, playerBId);
        }
    }


    private void tickBotQueue(UniqueQueue<Long> queue, Long gameTypeId) {
        while (!queue.isEmpty()) {
            final var playerId = queue.dequeue();

            final var botGame = botGameDetail.get(new BotGameKey(gameTypeId, playerId));
            if (botGame == null) {
                throw new IllegalStateException("Bot game detail not found");
            }
            botGameDetail.remove(new BotGameKey(gameTypeId, playerId));

            createBotGame(gameTypeId, playerId, botGame.getBotStrength());
        }
    }

    private void createBotGame(Long gameTypeId, Long playerId, Integer botStrength) {
        final var player = userRepository
                .findById(playerId)
                .orElseThrow(() -> new IllegalStateException("Player not found"));

        gameTypeRepository
                .findById(1L)
                .orElseThrow(() -> new IllegalStateException("Game type not found"));

        final var gameBuilder = CreateGameDto.builder()
                .gameTypeId(gameTypeId)
                .botStrength(botStrength);

        if (random.nextBoolean()) {
            gameBuilder
                    .whiteId(player.getId())
                    .blackId(ApplicationConfiguration.getBotId());
        } else {
            gameBuilder
                    .blackId(player.getId())
                    .whiteId(ApplicationConfiguration.getBotId());
        }

        final var game = gameBuilder.build();
        var createdGame = gameService.createGame(game);
        log.trace("Created new bot game: {}", createdGame);

        gameCreatedNotifier.notify(createdGame);
    }

    private void createGame(Long gameTypeId, Long playerAId, Long playerBId) {
        final var playerA = userRepository
                .findById(playerAId)
                .orElseThrow(() -> new IllegalStateException("Player not found"));

        final var playerB = userRepository
                .findById(playerBId)
                .orElseThrow(() -> new IllegalStateException("Player not found"));

        gameTypeRepository
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
        log.trace("Created new game: {}", createdGame);

        gameCreatedNotifier.notify(createdGame);
    }


    public void addToPool(Long userId, @Valid CreateGameMessage createGameMessage) {
        log.trace("Adding user {} to queue {}", userId, createGameMessage.getGameTypeId());

        final var gameType = gameTypeRepository
                .findById(createGameMessage.getGameTypeId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid game type"));

        switch (createGameMessage) {
            case CreateNormalGameMessage ignored -> {
                queues
                        .get(gameType.getId().intValue() - 1)
                        .enqueue(userId);
            }
            case CreateGameWithBotMessage botGame -> {
                if (botGame.getStrength() == null) {
                    throw new IllegalArgumentException("Bot strength cant be null");
                }
                botGameDetail.put(
                        new BotGameKey(gameType.getId(), userId), new BotGame(botGame.getStrength()));
                botQueues
                        .get(gameType.getId().intValue() - 1)
                        .enqueue(userId);
            }
            default -> throw new IllegalArgumentException("Invalid create game message type");
        }
    }
}
