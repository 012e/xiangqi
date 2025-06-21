package com.se330.ctuong_backend.service.elo;

import com.se330.ctuong_backend.model.Elo;
import com.se330.ctuong_backend.model.GameTypeRepository;
import com.se330.ctuong_backend.repository.EloRepository;
import com.se330.ctuong_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
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
        Elo elo = new Elo();
        elo.setId(key);
        elo.setCurrentElo(INITIAL_ELO);
        elo.setGameType(gameType);
        elo.setUser(user);
        eloRepository.save(elo);
    }
}
