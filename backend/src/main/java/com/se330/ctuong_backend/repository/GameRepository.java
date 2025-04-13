package com.se330.ctuong_backend.repository;

import com.se330.ctuong_backend.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRepository extends JpaRepository<Game, Long> {
    Game getGameById(String gameId);
}
