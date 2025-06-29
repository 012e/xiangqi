package com.se330.ctuong_backend.repository;

import com.se330.ctuong_backend.model.Invitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, Long> {
    
    @Query("SELECT i FROM Invitation i WHERE i.inviter.id = :inviterId AND i.recipient.id = :recipientId AND i.gameType.id = :gameTypeId AND i.isDeclined = false AND i.isAccepted = false AND i.expiresAt > :currentTime")
    Optional<Invitation> findPendingInvitationBetweenUsers(@Param("inviterId") Long inviterId, @Param("recipientId") Long recipientId, @Param("gameTypeId") Long gameTypeId, @Param("currentTime") Timestamp currentTime);
    
    @Query("SELECT i FROM Invitation i WHERE i.recipient.id = :userId AND i.isDeclined = false AND i.isAccepted = false AND i.expiresAt > :currentTime")
    List<Invitation> findPendingInvitationsForUser(@Param("userId") Long userId, @Param("currentTime") Timestamp currentTime);
    
    @Query("SELECT i FROM Invitation i WHERE i.inviter.id = :userId AND i.isDeclined = false AND i.isAccepted = false AND i.expiresAt > :currentTime")
    List<Invitation> findSentInvitationsByUser(@Param("userId") Long userId, @Param("currentTime") Timestamp currentTime);
    
    @Query("SELECT i FROM Invitation i WHERE i.expiresAt <= :currentTime AND i.isDeclined = false AND i.isAccepted = false")
    List<Invitation> findExpiredInvitations(@Param("currentTime") Timestamp currentTime);
    
    @Query("SELECT i FROM Invitation i WHERE i.gameId = :gameId")
    Optional<Invitation> findByGameId(@Param("gameId") Long gameId);
}
