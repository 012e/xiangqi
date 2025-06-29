package com.se330.ctuong_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(generator = "users_id_seq")
    @SequenceGenerator(name = "users_id_seq", sequenceName = "users_id_seq", allocationSize = 1)
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;

    @Column(name = "openid_sub", unique = true, nullable = false)
    private String sub;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "display_name")
    private String name;

    @Column(name = "username")
    private String username;

    @Column(name = "picture")
    private String picture;
}
