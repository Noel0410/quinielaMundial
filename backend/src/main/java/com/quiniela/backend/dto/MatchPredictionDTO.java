package com.quiniela.backend.dto;

import java.util.UUID;

public record MatchPredictionDTO(
        UUID matchId,
        String homeTeamName,
        String awayTeamName,
        String groupName,
        String stage,
        Integer matchOrder,
        Integer predictedHomeGoals,
        Integer predictedAwayGoals,
        Boolean isPredicted,
        Boolean finished,
        Boolean homeTeamAdvances) {
}
