package com.se330.ctuong_backend.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GameTypeRepository extends JpaRepository<GameType, Long> {
    Optional<GameType> getGameTypeById(Long id);
}
