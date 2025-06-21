package com.se330.ctuong_backend.repository;

import com.se330.ctuong_backend.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRepository extends JpaRepository<Game, String> {
    Game getGameById(String gameId);
}
