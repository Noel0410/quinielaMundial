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
                match.getHomeTeam() != null ? match.getHomeTeam().getName() : null,
                match.getAwayTeam() != null ? match.getAwayTeam().getName() : null,
                match.getHomeTeam() != null ? match.getHomeTeam().getGroupName() : null,
                match.getStage(),
                match.getMatchOrder(),
                match.getHomeTeamGoals(), 
                match.getAwayTeamGoals(), 
                match.getHomeTeamGoals() != null && match.getAwayTeamGoals() != null,
                false, 
                match.getHomeTeamAdvances(),
                match.getLimitDate()
        )).collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{matchId}/result")
    public ResponseEntity<?> updateMatchResult(
            @PathVariable UUID matchId,
            @RequestBody Map<String, Object> payload) {
        try {
            Integer homeGoals = (Integer) payload.get("homeGoals");
            Integer awayGoals = (Integer) payload.get("awayGoals");
            Boolean homeTeamAdvances = (Boolean) payload.get("homeTeamAdvances");
            matchService.updateMatchResult(matchId, homeGoals, awayGoals, homeTeamAdvances);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
