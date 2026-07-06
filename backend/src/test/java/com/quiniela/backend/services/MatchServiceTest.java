package com.quiniela.backend.services;

import com.quiniela.backend.model.Match;
import com.quiniela.backend.model.Prediction;
import com.quiniela.backend.model.Team;
import com.quiniela.backend.model.User;
import com.quiniela.backend.repository.MatchRepository;
import com.quiniela.backend.repository.PredictionRepository;
import com.quiniela.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith(MockitoExtension.class)
public class MatchServiceTest {

    @Mock
    private MatchRepository matchRepository;

    @Mock
    private PredictionRepository predictionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private MatchService matchService;

    private Team teamSpain;
    private Team teamPortugal;
    private Team teamFrance;
    private Team teamCroatia;

    @BeforeEach
    void setUp() {
        teamSpain = new Team();
        teamSpain.setId(UUID.randomUUID());
        teamSpain.setName("España");
        teamSpain.setShortName("ESP");
        teamSpain.setGroupName("A");

        teamPortugal = new Team();
        teamPortugal.setId(UUID.randomUUID());
        teamPortugal.setName("Portugal");
        teamPortugal.setShortName("POR");
        teamPortugal.setGroupName("A");

        teamFrance = new Team();
        teamFrance.setId(UUID.randomUUID());
        teamFrance.setName("Francia");
        teamFrance.setShortName("FRA");
        teamFrance.setGroupName("B");

        teamCroatia = new Team();
        teamCroatia.setId(UUID.randomUUID());
        teamCroatia.setName("Croacia");
        teamCroatia.setShortName("CRO");
        teamCroatia.setGroupName("B");
    }

    // Direct tests for calculatePoints in Knockout Stage

    @Test
    void testCalculatePoints_SameTeams_ExactScore() {
        Match match = new Match();
        match.setStage("Octavos");
        match.setHomeTeam(teamSpain);
        match.setAwayTeam(teamPortugal);

        // Real score: 2-1
        // Predicted score: 2-1
        int points = matchService.calculatePoints(
                match, teamSpain, teamPortugal,
                2, 1, null,
                2, 1, null
        );

        assertEquals(3, points);
    }

    @Test
    void testCalculatePoints_SameTeams_CorrectWinner_DifferentScore() {
        Match match = new Match();
        match.setStage("Octavos");
        match.setHomeTeam(teamSpain);
        match.setAwayTeam(teamPortugal);

        // Real score: 2-1 (Spain wins/advances)
        // Predicted score: 1-0 (Spain wins/advances)
        int points = matchService.calculatePoints(
                match, teamSpain, teamPortugal,
                1, 0, null,
                2, 1, null
        );

        assertEquals(1, points);
    }

    @Test
    void testCalculatePoints_SameTeams_WrongWinner() {
        Match match = new Match();
        match.setStage("Octavos");
        match.setHomeTeam(teamSpain);
        match.setAwayTeam(teamPortugal);

        // Real score: 2-1 (Spain wins/advances)
        // Predicted score: 1-2 (Portugal wins/advances)
        int points = matchService.calculatePoints(
                match, teamSpain, teamPortugal,
                1, 2, null,
                2, 1, null
        );

        assertEquals(0, points);
    }

    @Test
    void testCalculatePoints_DifferentTeams_AdvancingTeamMatches() {
        Match match = new Match();
        match.setStage("Octavos");
        match.setHomeTeam(teamSpain);
        match.setAwayTeam(teamPortugal);

        // Real matchup: Spain vs Portugal. Spain wins and advances.
        // Predicted matchup: Spain vs France. Spain wins and advances.
        int points = matchService.calculatePoints(
                match, teamSpain, teamFrance,
                2, 1, null,
                2, 1, null
        );

        // Spain advances in both. Spain matches. Points should be 1.
        assertEquals(1, points);
    }

    @Test
    void testCalculatePoints_DifferentTeams_AdvancingTeamDoesNotMatch() {
        Match match = new Match();
        match.setStage("Octavos");
        match.setHomeTeam(teamSpain);
        match.setAwayTeam(teamPortugal);

        // Real matchup: Spain vs Portugal. Portugal wins and advances.
        // Predicted matchup: France vs Portugal. France wins and advances.
        int points = matchService.calculatePoints(
                match, teamFrance, teamPortugal,
                2, 1, null,
                1, 2, null
        );

        // Portugal advances in real (Spain vs Portugal -> 1-2).
        // France advances in predicted (France vs Portugal -> 2-1).
        // They do not match. Points should be 0.
        assertEquals(0, points);
    }

    @Test
    void testCalculatePoints_DifferentTeams_NeitherParticipating() {
        Match match = new Match();
        match.setStage("Octavos");
        match.setHomeTeam(teamSpain);
        match.setAwayTeam(teamPortugal);

        // Real matchup: Spain vs Portugal.
        // Predicted matchup: France vs Croatia.
        int points = matchService.calculatePoints(
                match, teamFrance, teamCroatia,
                2, 1, null,
                2, 1, null
        );

        assertEquals(0, points);
    }

    @Test
    void testComputePredictedBracketTeams_Propagation() {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setUsername("testuser");

        List<Match> allMatches = new ArrayList<>();
        List<Prediction> userPredictions = new ArrayList<>();

        // Create 16 initial Dieciseisavos matches
        Team teamRSA = new Team(); teamRSA.setId(UUID.randomUUID()); teamRSA.setName("RSA");
        Team teamCAN = new Team(); teamCAN.setId(UUID.randomUUID()); teamCAN.setName("CAN");
        Team teamNED = new Team(); teamNED.setId(UUID.randomUUID()); teamNED.setName("NED");
        Team teamMAR = new Team(); teamMAR.setId(UUID.randomUUID()); teamMAR.setName("MAR");

        Match match1 = new Match();
        match1.setId(UUID.randomUUID());
        match1.setMatchOrder(1);
        match1.setStage("Dieciseisavos");
        match1.setHomeTeam(teamRSA);
        match1.setAwayTeam(teamCAN);
        allMatches.add(match1);

        Match match2 = new Match();
        match2.setId(UUID.randomUUID());
        match2.setMatchOrder(2);
        match2.setStage("Dieciseisavos");
        match2.setHomeTeam(teamNED);
        match2.setAwayTeam(teamMAR);
        allMatches.add(match2);

        // Create the target Octavos match (17)
        Match match17 = new Match();
        match17.setId(UUID.randomUUID());
        match17.setMatchOrder(17);
        match17.setStage("Octavos");
        allMatches.add(match17);

        // Predictions for Match 1 and Match 2
        Prediction pred1 = new Prediction();
        pred1.setMatch(match1);
        pred1.setHomeTeamGoals(2);
        pred1.setAwayTeamGoals(1); // RSA wins
        userPredictions.add(pred1);

        Prediction pred2 = new Prediction();
        pred2.setMatch(match2);
        pred2.setHomeTeamGoals(2);
        pred2.setAwayTeamGoals(1); // NED wins
        userPredictions.add(pred2);

        Map<Integer, MatchService.PredictedMatchTeams> predictedBracket = 
                matchService.computePredictedBracketTeams(user, allMatches, userPredictions);

        assertNotNull(predictedBracket);
        MatchService.PredictedMatchTeams pm17 = predictedBracket.get(17);
        assertNotNull(pm17);
        assertEquals(teamRSA, pm17.homeTeam);
        assertEquals(teamNED, pm17.awayTeam);
    }

    @Test
    void testComputePredictedBracketTeams_FallbackPropagation() {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setUsername("testuser");

        List<Match> allMatches = new ArrayList<>();
        List<Prediction> userPredictions = new ArrayList<>();

        Team teamRSA = new Team(); teamRSA.setId(UUID.randomUUID()); teamRSA.setName("RSA");
        Team teamCAN = new Team(); teamCAN.setId(UUID.randomUUID()); teamCAN.setName("CAN");
        Team teamNED = new Team(); teamNED.setId(UUID.randomUUID()); teamNED.setName("NED");
        Team teamMAR = new Team(); teamMAR.setId(UUID.randomUUID()); teamMAR.setName("MAR");

        Match match1 = new Match();
        match1.setId(UUID.randomUUID());
        match1.setMatchOrder(1);
        match1.setStage("Dieciseisavos");
        match1.setHomeTeam(teamRSA);
        match1.setAwayTeam(teamCAN);
        match1.setLimitDate(new java.sql.Timestamp(System.currentTimeMillis() - 10000)); // closed
        allMatches.add(match1);

        Match match2 = new Match();
        match2.setId(UUID.randomUUID());
        match2.setMatchOrder(2);
        match2.setStage("Dieciseisavos");
        match2.setHomeTeam(teamNED);
        match2.setAwayTeam(teamMAR);
        match2.setLimitDate(new java.sql.Timestamp(System.currentTimeMillis() - 10000)); // closed
        match2.setHomeTeamGoals(1);
        match2.setAwayTeamGoals(3); // MAR is real winner
        allMatches.add(match2);

        Match match17 = new Match();
        match17.setId(UUID.randomUUID());
        match17.setMatchOrder(17);
        match17.setStage("Octavos");
        allMatches.add(match17);

        // No predictions

        Map<Integer, MatchService.PredictedMatchTeams> predictedBracket = 
                matchService.computePredictedBracketTeams(user, allMatches, userPredictions);

        assertNotNull(predictedBracket);
        MatchService.PredictedMatchTeams pm17 = predictedBracket.get(17);
        assertNotNull(pm17);
        // Fallback to home team of match1
        assertEquals(teamRSA, pm17.homeTeam);
        // Fallback to real winner of match2 (MAR)
        assertEquals(teamMAR, pm17.awayTeam);
    }
}
