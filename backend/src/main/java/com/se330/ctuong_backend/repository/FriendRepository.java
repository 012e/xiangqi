package com.se330.ctuong_backend.repository;

import com.se330.ctuong_backend.model.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRepository extends JpaRepository<Friendship, Long> {
    @Query("SELECT f FROM Friendship f WHERE ((f.user1.id = :userId1 AND f.user2.id = :userId2) OR (f.user1.id = :userId2 AND f.user2.id = :userId1))")
    Optional<Friendship> findFriendshipBetweenUsers(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
    
    @Query("SELECT f FROM Friendship f WHERE (f.user1.id = :userId OR f.user2.id = :userId) AND f.status = 'accepted'")
    List<Friendship> findAcceptedFriendshipsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT f FROM Friendship f WHERE f.user2.id = :userId AND f.status = 'pending'")
    List<Friendship> findPendingFriendRequestsForUser(@Param("userId") Long userId);
    
    @Query("SELECT f FROM Friendship f WHERE f.user1.id = :userId AND f.status = 'pending'")
    List<Friendship> findSentFriendRequestsByUser(@Param("userId") Long userId);
}
