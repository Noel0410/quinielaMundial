package com.quiniela.backend.controller;

import com.quiniela.backend.dto.MatchPredictionDTO;
import com.quiniela.backend.model.Match;
import com.quiniela.backend.repository.MatchRepository;
import com.quiniela.backend.services.MatchService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/matches")
@AllArgsConstructor(onConstructor = @__({ @Autowired }))
public class MatchController {

    private final MatchRepository matchRepository;
    private final MatchService matchService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<MatchPredictionDTO> getAllMatches() {
        List<Match> matches = matchRepository.findAll();
        return matches.stream().map(match -> new MatchPredictionDTO(
                match.getId(),
                match.getHomeTeam().getName(),
                match.getAwayTeam().getName(),
                match.getHomeTeam().getGroupName(), // Assuming homeTeam.groupName is the match group
                match.getHomeTeamGoals(), // Using real result as "predicted" for admin view
                match.getAwayTeamGoals(), // Using real result as "predicted" for admin view
                match.getHomeTeamGoals() != null && match.getAwayTeamGoals() != null,
                false // Not used for this view, or we can use it to block edits if we wanted
        )).collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{matchId}/result")
    public ResponseEntity<?> updateMatchResult(
            @PathVariable UUID matchId,
            @RequestBody Map<String, Integer> payload) {
        try {
            Integer homeGoals = payload.get("homeGoals");
            Integer awayGoals = payload.get("awayGoals");
            matchService.updateMatchResult(matchId, homeGoals, awayGoals);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
