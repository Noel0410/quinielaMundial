package com.quiniela.backend.model;

import java.util.UUID;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "teams")
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String shortName;

    @Column(nullable = false)
    private String groupName;
}
