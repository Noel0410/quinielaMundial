const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
export const API_BASE_URL = rawApiUrl.replace(/\/$/, "");

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/auth/login`,
        SIGNUP: `${API_BASE_URL}/auth/signup`,
    },
    USERS: {
        LEADERBOARD: `${API_BASE_URL}/users/leaderboard`,
    },
    PREDICTIONS: {
        LIST: `${API_BASE_URL}/predictions`,
        LIMIT_DATE: (stage: string) => `${API_BASE_URL}/predictions/limit-date/${stage}`,
    }
} as const;

export const COMMON_HEADERS: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
};
