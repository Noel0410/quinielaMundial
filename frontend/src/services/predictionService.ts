import axios from 'axios';
import { API_ENDPOINTS, COMMON_HEADERS } from '../config/api';

export interface MatchPredictionDTO {
  matchId: string;
  homeTeamName: string;
  awayTeamName: string;
  groupName: string;
  predictedHomeGoals: number | null;
  predictedAwayGoals: number | null;
  isPredicted: boolean;
}

export const predictionService = {
  getMyPredictions: async (): Promise<MatchPredictionDTO[]> => {
    // Auth token is attached automatically by AuthContext's axios interceptor
    const response = await axios.get(API_ENDPOINTS.PREDICTIONS.LIST, {
      headers: COMMON_HEADERS,
    });
    return response.data;
  }
};
