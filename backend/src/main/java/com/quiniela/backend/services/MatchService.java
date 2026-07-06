package com.quiniela.backend.services;

import com.quiniela.backend.model.Match;
import com.quiniela.backend.model.Team;
import com.quiniela.backend.model.Prediction;
import com.quiniela.backend.model.User;
import com.quiniela.backend.repository.MatchRepository;
import com.quiniela.backend.repository.PredictionRepository;
import com.quiniela.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

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

        // Recalcular puntos de las predicciones de forma integral para asegurar consistencia
        recalculateAllKnockoutPredictions();

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

    public static class PredictedMatchTeams {
        public Team homeTeam;
        public Team awayTeam;
    }

    private void recalculateAllKnockoutPredictions() {
        List<Match> allMatches = matchRepository.findAll();
        List<Prediction> allPredictions = predictionRepository.findAll();

        Map<User, List<Prediction>> predictionsByUser = new HashMap<>();
        for (Prediction p : allPredictions) {
            predictionsByUser.computeIfAbsent(p.getUser(), k -> new ArrayList<>()).add(p);
        }

        for (Map.Entry<User, List<Prediction>> entry : predictionsByUser.entrySet()) {
            User user = entry.getKey();
            List<Prediction> userPredictions = entry.getValue();

            Map<Integer, PredictedMatchTeams> predictedBracket = computePredictedBracketTeams(user, allMatches, userPredictions);

            for (Prediction p : userPredictions) {
                Match m = p.getMatch();
                String stage = m.getStage();
                boolean isGroupStage = stage != null && (stage.equalsIgnoreCase("Fase de Grupos") || stage.equalsIgnoreCase("Group Stage"));

                if (!isGroupStage) {
                    PredictedMatchTeams pm = predictedBracket.get(m.getMatchOrder());
                    Team predHomeTeam = pm != null ? pm.homeTeam : null;
                    Team predAwayTeam = pm != null ? pm.awayTeam : null;

                    int points = calculatePoints(m, predHomeTeam, predAwayTeam, p.getHomeTeamGoals(), p.getAwayTeamGoals(), p.getHomeTeamAdvances(),
                            m.getHomeTeamGoals(), m.getAwayTeamGoals(), m.getHomeTeamAdvances());
                    p.setPoints(points);
                    predictionRepository.save(p);
                }
            }
        }
    }

    Map<Integer, PredictedMatchTeams> computePredictedBracketTeams(User user, List<Match> allMatches, List<Prediction> userPredictions) {
        Map<Integer, Match> matchMap = new HashMap<>();
        for (Match m : allMatches) {
            if (m.getMatchOrder() != null) {
                matchMap.put(m.getMatchOrder(), m);
            }
        }

        Map<Integer, Prediction> predMap = new HashMap<>();
        for (Prediction p : userPredictions) {
            if (p.getMatch().getMatchOrder() != null) {
                predMap.put(p.getMatch().getMatchOrder(), p);
            }
        }

        Map<Integer, PredictedMatchTeams> predictedTeamsMap = new HashMap<>();

        // Initialize matches 1 to 16 with their actual teams (since these are fixed in the bracket)
        for (int i = 1; i <= 16; i++) {
            Match m = matchMap.get(i);
            PredictedMatchTeams pm = new PredictedMatchTeams();
            if (m != null) {
                pm.homeTeam = m.getHomeTeam();
                pm.awayTeam = m.getAwayTeam();
            }
            predictedTeamsMap.put(i, pm);
        }

        // Helper to get winner team of a match order under user's prediction
        java.util.function.BiFunction<Integer, Map<Integer, PredictedMatchTeams>, Team> getPredictedWinner = (order, map) -> {
            PredictedMatchTeams pm = map.get(order);
            if (pm == null) return null;
            Prediction p = predMap.get(order);
            if (p == null || p.getHomeTeamGoals() == null || p.getAwayTeamGoals() == null) {
                Match m = matchMap.get(order);
                if (m != null) {
                    boolean isClosed = Boolean.TRUE.equals(m.getLimitDate() != null && new java.sql.Timestamp(System.currentTimeMillis()).after(m.getLimitDate()));
                    if (isClosed) {
                        Team realWinner = null;
                        if (m.getHomeTeamGoals() != null && m.getAwayTeamGoals() != null) {
                            if (m.getHomeTeamGoals() > m.getAwayTeamGoals()) {
                                realWinner = m.getHomeTeam();
                            } else if (m.getHomeTeamGoals() < m.getAwayTeamGoals()) {
                                realWinner = m.getAwayTeam();
                            } else {
                                if (Boolean.TRUE.equals(m.getHomeTeamAdvances())) {
                                    realWinner = m.getHomeTeam();
                                } else if (Boolean.FALSE.equals(m.getHomeTeamAdvances())) {
                                    realWinner = m.getAwayTeam();
                                }
                            }
                        }
                        if (realWinner != null) {
                            return realWinner;
                        }
                        return pm.homeTeam;
                    }
                }
                return null;
            }
            if (p.getHomeTeamGoals() > p.getAwayTeamGoals()) {
                return pm.homeTeam;
            } else if (p.getHomeTeamGoals() < p.getAwayTeamGoals()) {
                return pm.awayTeam;
            } else {
                if (Boolean.TRUE.equals(p.getHomeTeamAdvances())) {
                    return pm.homeTeam;
                } else if (Boolean.FALSE.equals(p.getHomeTeamAdvances())) {
                    return pm.awayTeam;
                }
            }
            return null;
        };

        // Helper to get loser team of a match order under user's prediction
        java.util.function.BiFunction<Integer, Map<Integer, PredictedMatchTeams>, Team> getPredictedLoser = (order, map) -> {
            PredictedMatchTeams pm = map.get(order);
            if (pm == null) return null;
            Prediction p = predMap.get(order);
            if (p == null || p.getHomeTeamGoals() == null || p.getAwayTeamGoals() == null) {
                Match m = matchMap.get(order);
                if (m != null) {
                    boolean isClosed = Boolean.TRUE.equals(m.getLimitDate() != null && new java.sql.Timestamp(System.currentTimeMillis()).after(m.getLimitDate()));
                    if (isClosed) {
                        Team realLoser = null;
                        if (m.getHomeTeamGoals() != null && m.getAwayTeamGoals() != null) {
                            if (m.getHomeTeamGoals() < m.getAwayTeamGoals()) {
                                realLoser = m.getHomeTeam();
                            } else if (m.getHomeTeamGoals() > m.getAwayTeamGoals()) {
                                realLoser = m.getAwayTeam();
                            } else {
                                if (Boolean.TRUE.equals(m.getHomeTeamAdvances())) {
                                    realLoser = m.getAwayTeam();
                                } else if (Boolean.FALSE.equals(m.getHomeTeamAdvances())) {
                                    realLoser = m.getHomeTeam();
                                }
                            }
                        }
                        if (realLoser != null) {
                            return realLoser;
                        }
                        return pm.awayTeam;
                    }
                }
                return null;
            }
            if (p.getHomeTeamGoals() < p.getAwayTeamGoals()) {
                return pm.homeTeam;
            } else if (p.getHomeTeamGoals() > p.getAwayTeamGoals()) {
                return pm.awayTeam;
            } else {
                if (Boolean.TRUE.equals(p.getHomeTeamAdvances())) {
                    return pm.awayTeam;
                } else if (Boolean.FALSE.equals(p.getHomeTeamAdvances())) {
                    return pm.homeTeam;
                }
            }
            return null;
        };

        // Propagate Octavos (17 to 24) from Dieciseisavos (1 to 16)
        for (int i = 0; i < 8; i++) {
            int match1 = i * 2 + 1;
            int match2 = i * 2 + 2;
            Team winner1 = getPredictedWinner.apply(match1, predictedTeamsMap);
            Team winner2 = getPredictedWinner.apply(match2, predictedTeamsMap);
            PredictedMatchTeams pm = new PredictedMatchTeams();
            pm.homeTeam = winner1;
            pm.awayTeam = winner2;
            predictedTeamsMap.put(17 + i, pm);
        }

        // Propagate Cuartos (25 to 28) from Octavos (17 to 24)
        for (int i = 0; i < 4; i++) {
            int match1 = 17 + i * 2;
            int match2 = 18 + i * 2;
            Team winner1 = getPredictedWinner.apply(match1, predictedTeamsMap);
            Team winner2 = getPredictedWinner.apply(match2, predictedTeamsMap);
            PredictedMatchTeams pm = new PredictedMatchTeams();
            pm.homeTeam = winner1;
            pm.awayTeam = winner2;
            predictedTeamsMap.put(25 + i, pm);
        }

        // Propagate Semifinal (29 to 30) from Cuartos (25 to 28)
        for (int i = 0; i < 2; i++) {
            int match1 = 25 + i * 2;
            int match2 = 26 + i * 2;
            Team winner1 = getPredictedWinner.apply(match1, predictedTeamsMap);
            Team winner2 = getPredictedWinner.apply(match2, predictedTeamsMap);
            PredictedMatchTeams pm = new PredictedMatchTeams();
            pm.homeTeam = winner1;
            pm.awayTeam = winner2;
            predictedTeamsMap.put(29 + i, pm);
        }

        // Propagate Tercer Lugar (31) and Final (32) from Semifinal (29 to 30)
        {
            Team winner29 = getPredictedWinner.apply(29, predictedTeamsMap);
            Team winner30 = getPredictedWinner.apply(30, predictedTeamsMap);
            PredictedMatchTeams pm32 = new PredictedMatchTeams();
            pm32.homeTeam = winner29;
            pm32.awayTeam = winner30;
            predictedTeamsMap.put(32, pm32);

            Team loser29 = getPredictedLoser.apply(29, predictedTeamsMap);
            Team loser30 = getPredictedLoser.apply(30, predictedTeamsMap);
            PredictedMatchTeams pm31 = new PredictedMatchTeams();
            pm31.homeTeam = loser29;
            pm31.awayTeam = loser30;
            predictedTeamsMap.put(31, pm31);
        }

        return predictedTeamsMap;
    }

    int calculatePoints(Match match, Team predHomeTeam, Team predAwayTeam, Integer predHome, Integer predAway, Boolean predHomeAdvances, Integer realHome, Integer realAway, Boolean realHomeAdvances) {
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
            // 1. Determine real overall winner team
            Team realWinnerTeam = null;
            if (realHome > realAway) {
                realWinnerTeam = match.getHomeTeam();
            } else if (realHome < realAway) {
                realWinnerTeam = match.getAwayTeam();
            } else {
                if (Boolean.TRUE.equals(realHomeAdvances)) {
                    realWinnerTeam = match.getHomeTeam();
                } else if (Boolean.FALSE.equals(realHomeAdvances)) {
                    realWinnerTeam = match.getAwayTeam();
                }
            }

            // 2. Determine predicted overall winner team
            Team predWinnerTeam = null;
            if (predHome > predAway) {
                predWinnerTeam = predHomeTeam;
            } else if (predHome < predAway) {
                predWinnerTeam = predAwayTeam;
            } else {
                if (Boolean.TRUE.equals(predHomeAdvances)) {
                    predWinnerTeam = predHomeTeam;
                } else if (Boolean.FALSE.equals(predHomeAdvances)) {
                    predWinnerTeam = predAwayTeam;
                }
            }

            // Points only count if the advancing team matches
            if (realWinnerTeam == null || predWinnerTeam == null || !realWinnerTeam.getId().equals(predWinnerTeam.getId())) {
                return 0;
            }

            boolean exactScore = predHome.equals(realHome) && predAway.equals(realAway);
            boolean realDraw = realHome.equals(realAway);
            boolean predDraw = predHome.equals(predAway);

            // If matchups are identical, run the standard point scoring logic
            boolean identicalMatchup = predHomeTeam != null && predAwayTeam != null 
                    && match.getHomeTeam() != null && match.getAwayTeam() != null
                    && predHomeTeam.getId().equals(match.getHomeTeam().getId()) 
                    && predAwayTeam.getId().equals(match.getAwayTeam().getId());

            if (identicalMatchup) {
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
            } else {
                // Different matchups, but the advancing team matches -> 1 point
                return 1;
            }
        }
    }
}
