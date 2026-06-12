const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
export const API_BASE_URL = rawApiUrl.replace(/\/$/, "");

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/auth/login`,
        SIGNUP: `${API_BASE_URL}/auth/signup`,
        RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    },
    USERS: {
        LEADERBOARD: `${API_BASE_URL}/users/leaderboard`,
    },
    PREDICTIONS: {
        LIST: `${API_BASE_URL}/predictions`,
        LIMIT_DATE: (stage: string) => `${API_BASE_URL}/predictions/limit-date/${stage}`,
        LIMIT_DATE_MATCH: (matchId: string) => `${API_BASE_URL}/predictions/limit-date/match/${matchId}`,
    },
    MATCHES: {
        LIST: `${API_BASE_URL}/matches`,
        UPDATE_RESULT: (matchId: string) => `${API_BASE_URL}/matches/${matchId}/result`,
    }
} as const;

export const COMMON_HEADERS: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
};
