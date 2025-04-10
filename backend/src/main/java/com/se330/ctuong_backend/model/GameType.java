package com.se330.ctuong_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "game_types")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GameType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "type_name", nullable = false, length = 50)
    private String typeName;

    @Column(name = "time_control", nullable = false)
    private Integer timeControl;

    @Column(name = "increment")
    private Integer increment;
}
