package com.quiniela.backend.dto;

public record UserLeaderboardResponse(
        String username,
        int totalPoints,
        int groupStagePoints,
        int knockoutStagePoints) {
}
