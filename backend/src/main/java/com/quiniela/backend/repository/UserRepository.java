package com.quiniela.backend.repository;

import com.quiniela.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query(value = "UPDATE users SET total_points = (SELECT COALESCE(SUM(points), 0) FROM predictions WHERE user_id = users.id)", nativeQuery = true)
    void recalculateTotalPoints();

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query(value = "UPDATE users SET group_stage_points = (SELECT COALESCE(SUM(p.points), 0) FROM predictions p JOIN matches m ON p.match_id = m.id WHERE p.user_id = users.id AND m.stage = 'Fase de Grupos')", nativeQuery = true)
    void recalculateGroupStagePoints();
}
