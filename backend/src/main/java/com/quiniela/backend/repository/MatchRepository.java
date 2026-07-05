package com.quiniela.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.quiniela.backend.model.Match;
import java.util.UUID;
import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, UUID> {
    List<Match> findByStage(String stage);
    java.util.Optional<Match> findByMatchOrder(Integer matchOrder);
}
