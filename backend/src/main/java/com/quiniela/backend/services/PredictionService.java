package com.quiniela.backend.services;

import com.quiniela.backend.dto.MatchPredictionDTO;
import com.quiniela.backend.model.Match;
import com.quiniela.backend.model.Prediction;
import com.quiniela.backend.model.User;
import com.quiniela.backend.repository.MatchRepository;
import com.quiniela.backend.repository.PredictionRepository;
import com.quiniela.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class PredictionService {

    private final MatchRepository matchRepository;
    private final PredictionRepository predictionRepository;
    private final UserRepository userRepository;

    public List<MatchPredictionDTO> getUserPredictions(String username) {
        User user = userRepository.findByUsernameIgnoreCase(username).orElseThrow();
        List<Match> allMatches = matchRepository.findAll();
        List<Prediction> userPredictions = predictionRepository.findByUser(user);

        return allMatches.stream().map(match -> {
            Optional<Prediction> predictionOpt = userPredictions.stream()
                    .filter(p -> p.getMatch().getId().equals(match.getId()))
                    .findFirst();

            return new MatchPredictionDTO(
                    match.getId(),
                    match.getHomeTeam() != null ? match.getHomeTeam().getName() : null,
                    match.getAwayTeam() != null ? match.getAwayTeam().getName() : null,
                    match.getHomeTeam() != null ? match.getHomeTeam().getGroupName() : null,
                    match.getStage(),
                    match.getMatchOrder(),
                    predictionOpt.map(Prediction::getHomeTeamGoals).orElse(null),
                    predictionOpt.map(Prediction::getAwayTeamGoals).orElse(null),
                    predictionOpt.isPresent(),
                    match.getLimitDate() != null
                            && new Timestamp(System.currentTimeMillis()).after(match.getLimitDate()),
                    predictionOpt.map(Prediction::getHomeTeamAdvances).orElse(null));
        }).collect(Collectors.toList());
    }

    @Transactional
    public void savePredictions(String username, List<MatchPredictionDTO> predictionsDTO) {
        User user = userRepository.findByUsernameIgnoreCase(username).orElseThrow();
        List<Prediction> existingPredictions = predictionRepository.findByUser(user);

        for (MatchPredictionDTO dto : predictionsDTO) {
            if (dto.predictedHomeGoals() == null || dto.predictedAwayGoals() == null) {
                continue;
            }

            Match match = matchRepository.findById(dto.matchId())
                    .orElseThrow(() -> new RuntimeException("Match not found"));

            Optional<Prediction> existingOpt = existingPredictions.stream()
                    .filter(p -> p.getMatch().getId().equals(match.getId()))
                    .findFirst();

            Prediction prediction = existingOpt.orElse(new Prediction());
            if (match.getLimitDate() != null && new Timestamp(System.currentTimeMillis()).after(match.getLimitDate())) {
                // Skip the prediction if it's locked, so it doesn't prevent other predictions in the group from saving
                continue;
            }
            prediction.setUser(user);
            prediction.setMatch(match);
            prediction.setHomeTeamGoals(dto.predictedHomeGoals());
            prediction.setAwayTeamGoals(dto.predictedAwayGoals());
            prediction.setHomeTeamAdvances(dto.homeTeamAdvances());
            prediction.setLimitDate(match.getLimitDate());

            predictionRepository.save(prediction);
        }
    }

    @Transactional
    public void setLimitDateForStage(String stage, Timestamp limitDate) {
        List<Match> matches = matchRepository.findByStage(stage);
        for (Match match : matches) {
            match.setLimitDate(limitDate);
            matchRepository.save(match);
        }
        predictionRepository.updateLimitDateByStage(stage, limitDate);
    }

    @Transactional
    public void setLimitDateForMatch(java.util.UUID matchId, Timestamp limitDate) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));
        match.setLimitDate(limitDate);
        matchRepository.save(match);

        List<Prediction> predictions = predictionRepository.findByMatch(match);
        for (Prediction p : predictions) {
            p.setLimitDate(limitDate);
        }
        predictionRepository.saveAll(predictions);
    }
}
