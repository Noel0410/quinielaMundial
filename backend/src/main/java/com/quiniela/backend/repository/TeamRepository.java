package com.quiniela.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.quiniela.backend.model.Team;
import java.util.UUID;
import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, UUID> {
    List<Team> findByGroupName(String groupName);
}
