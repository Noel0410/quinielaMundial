package com.quiniela.backend.controller;

import com.quiniela.backend.dto.MatchPredictionDTO;
import com.quiniela.backend.services.PredictionService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<Void> savePredictions(
            @RequestBody List<MatchPredictionDTO> predictions,
            Authentication authentication) {
        predictionService.savePredictions(authentication.getName(), predictions);
        return ResponseEntity.ok().build();
    }
}
