package com.quiniela.backend.services;

import com.quiniela.backend.model.Match;
import com.quiniela.backend.model.Team;
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
    public void updateMatchResult(UUID matchId, Integer homeGoals, Integer awayGoals, Boolean homeTeamAdvances) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        match.setHomeTeamGoals(homeGoals);
        match.setAwayTeamGoals(awayGoals);
        match.setHomeTeamAdvances(homeTeamAdvances);
        matchRepository.save(match);

        // Propagar ganadores a la siguiente ronda
        propagateWinner(match);

        // Recalcular puntos de las predicciones
        List<Prediction> predictions = predictionRepository.findByMatch(match);
        for (Prediction p : predictions) {
            int points = calculatePoints(match, p.getHomeTeamGoals(), p.getAwayTeamGoals(), p.getHomeTeamAdvances(), homeGoals, awayGoals, homeTeamAdvances);
            p.setPoints(points);
            predictionRepository.save(p);
        }

        // Actualizar puntos de usuarios masivamente
        userRepository.recalculateTotalPoints();
        userRepository.recalculateGroupStagePoints();
    }

    private void propagateWinner(Match match) {
        Integer matchOrder = match.getMatchOrder();
        if (matchOrder == null || matchOrder < 1 || matchOrder > 30) {
            return;
        }

        Team winner = null;
        Team loser = null;

        Integer homeGoals = match.getHomeTeamGoals();
        Integer awayGoals = match.getAwayTeamGoals();

        if (homeGoals != null && awayGoals != null) {
            if (homeGoals > awayGoals) {
                winner = match.getHomeTeam();
                loser = match.getAwayTeam();
            } else if (homeGoals < awayGoals) {
                winner = match.getAwayTeam();
                loser = match.getHomeTeam();
            } else {
                Boolean advances = match.getHomeTeamAdvances();
                if (Boolean.TRUE.equals(advances)) {
                    winner = match.getHomeTeam();
                    loser = match.getAwayTeam();
                } else if (Boolean.FALSE.equals(advances)) {
                    winner = match.getAwayTeam();
                    loser = match.getHomeTeam();
                }
            }
        }

        // Propagate to next match based on matchOrder rules
        if (matchOrder >= 1 && matchOrder <= 16) {
            int targetOrder = 17 + (matchOrder - 1) / 2;
            boolean isHome = (matchOrder % 2 != 0);
            updateTargetMatch(targetOrder, isHome, winner);
        } else if (matchOrder >= 17 && matchOrder <= 24) {
            int targetOrder = 25 + (matchOrder - 17) / 2;
            boolean isHome = (matchOrder % 2 != 0);
            updateTargetMatch(targetOrder, isHome, winner);
        } else if (matchOrder >= 25 && matchOrder <= 28) {
            int targetOrder = 29 + (matchOrder - 25) / 2;
            boolean isHome = (matchOrder % 2 != 0);
            updateTargetMatch(targetOrder, isHome, winner);
        } else if (matchOrder == 29 || matchOrder == 30) {
            boolean isHome = (matchOrder == 29);
            // Final (32)
            updateTargetMatch(32, isHome, winner);
            // Tercer lugar (31)
            updateTargetMatch(31, isHome, loser);
        }
    }

    private void updateTargetMatch(int targetOrder, boolean isHome, Team team) {
        matchRepository.findByMatchOrder(targetOrder).ifPresent(targetMatch -> {
            if (isHome) {
                targetMatch.setHomeTeam(team);
            } else {
                targetMatch.setAwayTeam(team);
            }
            matchRepository.save(targetMatch);
        });
    }

    private int calculatePoints(Match match, Integer predHome, Integer predAway, Boolean predHomeAdvances, Integer realHome, Integer realAway, Boolean realHomeAdvances) {
        if (predHome == null || predAway == null || realHome == null || realAway == null) {
            return 0;
        }

        String stage = match.getStage();
        boolean isGroupStage = stage != null && (stage.equalsIgnoreCase("Fase de Grupos") || stage.equalsIgnoreCase("Group Stage"));

        if (isGroupStage) {
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
        } else {
            // Knockout stage scoring logic
            boolean exactScore = predHome.equals(realHome) && predAway.equals(realAway);
            boolean realDraw = realHome.equals(realAway);
            boolean predDraw = predHome.equals(predAway);

            // Determine real overall winner (true = home, false = away)
            Boolean realWinner = null;
            if (realHome > realAway) {
                realWinner = true;
            } else if (realHome < realAway) {
                realWinner = false;
            } else {
                realWinner = realHomeAdvances;
            }

            // Determine predicted overall winner (true = home, false = away)
            Boolean predWinner = null;
            if (predHome > predAway) {
                predWinner = true;
            } else if (predHome < predAway) {
                predWinner = false;
            } else {
                predWinner = predHomeAdvances;
            }

            if (exactScore) {
                if (realDraw) {
                    // Empate exacto: 2 puntos + 1 si acertó quién avanza
                    if (predHomeAdvances != null && predHomeAdvances.equals(realHomeAdvances)) {
                        return 3;
                    }
                    return 2;
                } else {
                    // Victoria exacta: 3 puntos
                    return 3;
                }
            } else {
                // Marcador no exacto
                if (realDraw) {
                    if (predDraw) {
                        // Empate normal: 1 punto + 1 si acertó quién avanza
                        if (predHomeAdvances != null && predHomeAdvances.equals(realHomeAdvances)) {
                            return 2;
                        }
                        return 1;
                    } else {
                        // Pronosticó ganador directo, pero fue empate y se definió por penales
                        if (predWinner != null && predWinner.equals(realWinner)) {
                            return 1;
                        }
                        return 0;
                    }
                } else {
                    // Ganador real directo (no empate)
                    if (predWinner != null && predWinner.equals(realWinner)) {
                        return 1;
                    }
                    return 0;
                }
            }
        }
    }
}
