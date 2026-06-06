package com.quiniela.backend.dto;

import java.util.UUID;

public record MatchPredictionDTO(
        UUID matchId,
        String homeTeamName,
        String awayTeamName,
        String groupName,
        Integer predictedHomeGoals,
        Integer predictedAwayGoals,
        Boolean isPredicted,
        Boolean finished) {
}
