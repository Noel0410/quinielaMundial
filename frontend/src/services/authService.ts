import axios from 'axios';
import { API_ENDPOINTS, COMMON_HEADERS } from '../config/api';

export const authService = {
  login: async (credentials: Record<string, string>) => {
    const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, credentials, {
      headers: COMMON_HEADERS,
    });
    return response.data;
  },
  signup: async (userData: Record<string, string>) => {
    const response = await axios.post(API_ENDPOINTS.AUTH.SIGNUP, userData, {
      headers: COMMON_HEADERS,
    });
    return response.data;
  }
};
