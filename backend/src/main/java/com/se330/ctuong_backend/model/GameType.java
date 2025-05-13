package com.se330.ctuong_backend.model;

import com.se330.ctuong_backend.config.Jpa;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Duration;

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

    @Column(name = "time_control", nullable = false, columnDefinition = "bigint")
    @Convert(converter = Jpa.DurationToLongConverter.class)
    private Duration timeControl;
}
