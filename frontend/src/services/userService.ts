import axios from 'axios';
import { API_ENDPOINTS, COMMON_HEADERS } from '../config/api';

export interface UserLeaderboardResponse {
  username: string;
  points: number;
}

export const userService = {
  getLeaderboard: async (): Promise<UserLeaderboardResponse[]> => {
    const response = await axios.get(API_ENDPOINTS.USERS.LEADERBOARD, {
      headers: COMMON_HEADERS,
    });
    return response.data;
  }
};
