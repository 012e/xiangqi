package com.se330.ctuong_backend.repository;

import com.se330.ctuong_backend.model.GameType;
import com.se330.ctuong_backend.model.User;
import lombok.Data;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsUserBySub(String sub);

    @Query(value = "SELECT " +
            "sub.totalGames AS totalGames, " +
            "sub.gameTypeName AS gameTypeName, " +
            "sub.gameTypeId AS gameTypeId, " +
            "sub.elo AS elo " +
            "FROM (" +
            "    SELECT " +
            "        COUNT(g.id) AS totalGames, " +
            "        t.time_control AS timeControl, " +
            "        t.type_name AS gameTypeName, " +
            "        t.id AS gameTypeId, " +
            "        e.current_elo AS elo " +
            "    FROM users u " +
            "    LEFT JOIN games g ON (g.black_player_id = u.id OR g.white_player_id = u.id) " +
            "    LEFT JOIN game_types t ON t.id = g.game_type_id AND t.id = :gameTypeId " +
            "    LEFT JOIN elo e ON e.game_type_id = t.id AND e.user_id = u.id " +
            "    WHERE u.id = :userId " + // Use :userId to avoid conflict with :id
            "    GROUP BY t.id, t.type_name, t.time_control, e.current_elo " +
            ") AS sub " +
            "WHERE sub.gameTypeId IS NOT NULL " + // This is the crucial part!
            "LIMIT 1",
            nativeQuery = true)
    Optional<GameStat> getGameStatByUserId(@Param("userId") Long userId, @Param("gameTypeId") Long gameTypeId);

    Optional<User> getUserBySub(String sub);

    Optional<User> getUserById(Long id);

    Page<User> findByUsernameContainingIgnoreCase(String username, Pageable pageable);
}
