package com.se330.ctuong_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Entity
@Table(name = "invitations")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Invitation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "game_type_id", nullable = false)
    private GameType gameType;

    @ManyToOne
    @JoinColumn(name = "inviter_id", nullable = false)
    private User inviter;

    @ManyToOne
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;

    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    @Column(name = "is_declined", nullable = false)
    private Boolean isDeclined = false;

    @Column(name = "is_accepted", nullable = false)
    private Boolean isAccepted = false;

    @Column(name = "game_id")
    private Long gameId;

    @Column(name = "expires_at")
    private Timestamp expiresAt;

    @Column(name = "message", length = 500)
    private String message;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = new Timestamp(System.currentTimeMillis());
        }
        if (expiresAt == null) {
            // Set expiration to 24 hours from creation
            expiresAt = new Timestamp(System.currentTimeMillis() + 24 * 60 * 60 * 1000);
        }
    }
}
