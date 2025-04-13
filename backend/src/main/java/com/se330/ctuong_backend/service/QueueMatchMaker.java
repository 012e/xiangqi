package com.se330.ctuong_backend.service;

import com.se330.ctuong_backend.model.Game;
import com.se330.ctuong_backend.repository.GameRepository;
import com.se330.ctuong_backend.repository.UserRepository;
import com.se330.ctuong_backend.util.UniqueQueue;
import com.se330.xiangqi.Xiangqi;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QueueMatchMaker implements MatchMaker {
    private static final UniqueQueue<Long> queue = new UniqueQueue<>();
    private final GameCreatedNotifier gameCreatedNotifier;
    private final GameRepository gameRepository;
    private final Random random;
    private final UserRepository userRepository;

    @Scheduled(fixedDelay = 1000)
    protected void scheduleFixedDelayTask() {
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

        final var gameBuilder = Game.builder()
                .id(UUID.randomUUID().toString())
                .isRated(true)
                .uciFen(Xiangqi.INITIAL_UCI_FEN);

        if (random.nextBoolean()) {
            gameBuilder.whitePlayer(playerA)
                    .blackPlayer(playerB);
        } else {
            gameBuilder.whitePlayer(playerB)
                    .blackPlayer(playerA);
        }

        final var game = gameBuilder.build();
        gameRepository.save(game);
        gameCreatedNotifier.notify(game);
    }


    @Override
    public void addToPlayerPool(Long userId) {
        queue.enqueue(userId);
    }
}
