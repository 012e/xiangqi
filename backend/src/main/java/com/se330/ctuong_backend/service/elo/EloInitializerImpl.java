package com.se330.ctuong_backend.service.elo;

import com.se330.ctuong_backend.model.Elo;
import com.se330.ctuong_backend.model.GameTypeRepository;
import com.se330.ctuong_backend.repository.EloRepository;
import com.se330.ctuong_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class EloInitializerImpl implements EloInitializer {
    private final EloRepository eloRepository;
    private final GameTypeRepository gameTypeRepository;
    private final UserRepository userRepository;

    private static final Double INITIAL_ELO = 1500.0;

    @Transactional
    public void initializeEloIfNotExists(Long playerId, Long gameTypeId) {
        if (eloRepository.existsByUserIdAndGameTypeId(playerId, gameTypeId)) {
            return; // Elo already initialized for this player and game type
        }

        final var key = new Elo.Pk(playerId, gameTypeId);
        final var gameType = gameTypeRepository
                .findById(gameTypeId)
                .orElseThrow(() -> new IllegalArgumentException("Game type not found with id: " + gameTypeId));
        final var user = userRepository
                .findById(playerId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + playerId));
        final var elo = Elo.builder()
                .id(key)
                .currentElo(INITIAL_ELO)
                .gameType(gameType)
                .user(user)
                .build();
        eloRepository.saveAndFlush(elo);
    }
}
