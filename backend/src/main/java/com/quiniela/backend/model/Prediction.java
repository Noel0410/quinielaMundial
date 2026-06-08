package com.quiniela.backend.model;

import java.sql.Timestamp;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "predictions")
public class Prediction {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    @Column(nullable = false)
    private Integer homeTeamGoals;

    @Column(nullable = false)
    private Integer awayTeamGoals;


    @Column(nullable = true)
    private Timestamp limitDate = null;

    @Column(nullable = false)
    private Integer points = 0;
}
