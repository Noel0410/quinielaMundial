package com.quiniela.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.quiniela.backend.model.Prediction;
import com.quiniela.backend.model.User;
import java.util.UUID;
import java.util.List;

@Repository
public interface PredictionRepository extends JpaRepository<Prediction, UUID> {
    List<Prediction> findByUser(User user);
}
