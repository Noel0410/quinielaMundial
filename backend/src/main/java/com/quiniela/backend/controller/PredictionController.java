package com.quiniela.backend.controller;

import com.quiniela.backend.dto.MatchPredictionDTO;
import com.quiniela.backend.services.PredictionService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/predictions")
@AllArgsConstructor(onConstructor = @__({ @Autowired }))
public class PredictionController {

    private final PredictionService predictionService;

    @GetMapping
    public List<MatchPredictionDTO> getMyPredictions(Authentication authentication) {
        String username = authentication.getName();
        return predictionService.getUserPredictions(username);
    }

    @PostMapping
    public ResponseEntity<?> savePredictions(
            @RequestBody List<MatchPredictionDTO> predictions,
            Authentication authentication) {
        try {
            predictionService.savePredictions(authentication.getName(), predictions);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/limit-date/{stage}")
    public ResponseEntity<Void> setLimitDateForStage(
            @PathVariable String stage,
            @RequestBody Map<String, String> payload,
            Authentication authentication) {
        String limitDateStr = payload.get("limitDate");
        if (limitDateStr != null && !limitDateStr.isEmpty()) {
            limitDateStr = limitDateStr.replace("T", " ") + ":00";
            Timestamp limitDate = Timestamp.valueOf(limitDateStr);
            predictionService.setLimitDateForStage(stage, limitDate);
        }
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/limit-date/match/{matchId}")
    public ResponseEntity<Void> setLimitDateForMatch(
            @PathVariable java.util.UUID matchId,
            @RequestBody Map<String, String> payload,
            Authentication authentication) {
        String limitDateStr = payload.get("limitDate");
        if (limitDateStr != null && !limitDateStr.isEmpty()) {
            limitDateStr = limitDateStr.replace("T", " ") + ":00";
            Timestamp limitDate = Timestamp.valueOf(limitDateStr);
            predictionService.setLimitDateForMatch(matchId, limitDate);
        }
        return ResponseEntity.ok().build();
    }
}
