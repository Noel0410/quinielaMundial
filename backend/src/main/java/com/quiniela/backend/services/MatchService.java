package com.quiniela.backend.services;

import com.quiniela.backend.model.Match;
import com.quiniela.backend.model.Prediction;
import com.quiniela.backend.repository.MatchRepository;
import com.quiniela.backend.repository.PredictionRepository;
import com.quiniela.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class MatchService {

    private final MatchRepository matchRepository;
    private final PredictionRepository predictionRepository;
    private final UserRepository userRepository;

    @Transactional
    public void updateMatchResult(UUID matchId, Integer homeGoals, Integer awayGoals) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        match.setHomeTeamGoals(homeGoals);
        match.setAwayTeamGoals(awayGoals);
        matchRepository.save(match);

        // Recalcular puntos de las predicciones
        List<Prediction> predictions = predictionRepository.findByMatch(match);
        for (Prediction p : predictions) {
            int points = calculatePoints(p.getHomeTeamGoals(), p.getAwayTeamGoals(), homeGoals, awayGoals);
            p.setPoints(points);
            predictionRepository.save(p);
        }

        // Actualizar puntos de usuarios masivamente
        userRepository.recalculateTotalPoints();
        userRepository.recalculateGroupStagePoints();
    }

    private int calculatePoints(Integer predHome, Integer predAway, Integer realHome, Integer realAway) {
        if (predHome == null || predAway == null || realHome == null || realAway == null) {
            return 0;
        }

        if (predHome.equals(realHome) && predAway.equals(realAway)) {
            return 3;
        }

        boolean realHomeWins = realHome > realAway;
        boolean realAwayWins = realAway > realHome;
        boolean realDraw = realHome.equals(realAway);

        boolean predHomeWins = predHome > predAway;
        boolean predAwayWins = predAway > predHome;
        boolean predDraw = predHome.equals(predAway);

        if ((realHomeWins && predHomeWins) || (realAwayWins && predAwayWins) || (realDraw && predDraw)) {
            return 1;
        }

        return 0;
    }
}
