package com.quiniela.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.quiniela.backend.model.Prediction;
import com.quiniela.backend.model.User;
import com.quiniela.backend.model.Match;
import java.sql.Timestamp;
import java.util.UUID;
import java.util.List;

@Repository
public interface PredictionRepository extends JpaRepository<Prediction, UUID> {
    List<Prediction> findByUser(User user);

    @Modifying
    @Query("UPDATE Prediction p SET p.limitDate = :limitDate WHERE p.match.stage = :stage")
    void updateLimitDateByStage(@Param("stage") String stage, @Param("limitDate") Timestamp limitDate);

    List<Prediction> findByMatch(Match match);
}
