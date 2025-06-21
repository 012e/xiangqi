package com.se330.ctuong_backend.repository;

import com.se330.ctuong_backend.model.Elo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EloRepository extends JpaRepository<Elo, Long> {

    @Modifying
    @Query(value = "update elo e set current_elo = :new_elo where e.user_id = :user_id and e.game_type_id = :game_type_id",
            nativeQuery = true)
    void updateEloByUserId(@Param("user_id") Long userId, @Param("game_type_id") Long gameTypeId, @Param("new_elo") Double newElo);

    @Query(value = "select exists(select * from elo e where e.user_id = :user_id and e.game_type_id = :game_type_id)",
            nativeQuery = true)
    boolean existsByUserIdAndGameTypeId(@Param("user_id") Long userId, @Param("game_type_id") Long gameTypeId);
}
