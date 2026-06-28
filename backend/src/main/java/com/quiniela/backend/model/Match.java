package com.quiniela.backend.model;

import java.sql.Timestamp;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "matches")
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "home_team_id", nullable = true)
    private Team homeTeam;

    @ManyToOne
    @JoinColumn(name = "away_team_id", nullable = true)
    private Team awayTeam;

    @Column(nullable = false)
    private String stage;

    @Column(nullable = true)
    private Integer matchOrder;

    @Column
    private Integer homeTeamGoals;

    @Column
    private Integer awayTeamGoals;

    @Column(nullable = true)
    private Timestamp limitDate;
}
