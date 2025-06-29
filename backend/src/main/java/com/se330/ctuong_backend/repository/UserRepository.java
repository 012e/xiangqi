package com.se330.ctuong_backend.repository;

import com.se330.ctuong_backend.model.Game;
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
            "       COUNT(g.id) AS totalGames, " +
            "       gt.type_name AS gameTypeName, " +
            "       gt.id AS gameTypeId, " +
            "       e.current_elo AS elo " +
            "FROM users u " +
            "INNER JOIN game_types gt ON gt.id = :gameTypeId " +
            "LEFT JOIN games g ON (g.black_player_id = u.id OR g.white_player_id = u.id) " +
            "                  AND g.game_type_id = gt.id " +
            "LEFT JOIN elo e ON e.game_type_id = gt.id AND e.user_id = u.id " +
            "WHERE u.id = :userId " +
            "GROUP BY gt.id, gt.type_name, gt.time_control, e.current_elo",
            nativeQuery = true)
    Optional<GameStat> getGameStatByUserId(@Param("userId") Long userId, @Param("gameTypeId") Long gameTypeId);

    @Query(value = "SELECT g FROM Game g WHERE g.whitePlayer.id = :userId OR g.blackPlayer.id = :userId order by g.createdAt desc")
    List<Game> getAllGamesByUserId(Long userId);

    Optional<User> getUserBySub(String sub);

    Optional<User> getUserById(Long id);

    Page<User> findByUsernameContainingIgnoreCase(String username, Pageable pageable);

}
