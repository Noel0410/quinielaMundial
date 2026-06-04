package com.quiniela.backend.services;

import com.quiniela.backend.dto.MatchPredictionDTO;
import com.quiniela.backend.model.Match;
import com.quiniela.backend.model.Prediction;
import com.quiniela.backend.model.User;
import com.quiniela.backend.repository.MatchRepository;
import com.quiniela.backend.repository.PredictionRepository;
import com.quiniela.backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        User user = userRepository.findByUsername(username).orElseThrow();
        List<Match> allMatches = matchRepository.findAll();
        List<Prediction> userPredictions = predictionRepository.findByUser(user);

        return allMatches.stream().map(match -> {
            Optional<Prediction> predictionOpt = userPredictions.stream()
                    .filter(p -> p.getMatch().getId().equals(match.getId()))
                    .findFirst();

            return new MatchPredictionDTO(
                    match.getId(),
                    match.getHomeTeam().getName(),
                    match.getAwayTeam().getName(),
                    match.getHomeTeam().getGroupName(), // Asumiendo que homeTeam.groupName es el grupo del partido
                    predictionOpt.map(Prediction::getHomeTeamGoals).orElse(null),
                    predictionOpt.map(Prediction::getAwayTeamGoals).orElse(null),
                    predictionOpt.isPresent()
            );
        }).collect(Collectors.toList());
    }
}
