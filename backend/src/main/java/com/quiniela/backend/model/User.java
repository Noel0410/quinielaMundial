package com.quiniela.backend.model;

import java.util.UUID;
import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Getter
@Setter
@ToString
@Table(name = "users")
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private int totalPoints = 0;

    @Column(nullable = false)
    private int groupStagePoints = 0;
}
