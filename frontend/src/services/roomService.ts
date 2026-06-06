import axios from 'axios';
import { API_BASE_URL, COMMON_HEADERS } from '../config/api';

export interface RoomDTO {
  id: string;
  code: string;
  name: string;
  ownerUsername: string;
  memberCount: number;
}

export const roomService = {
  createRoom: async (name: string): Promise<RoomDTO> => {
    const response = await axios.post(`${API_BASE_URL}/rooms`, { name }, {
      headers: COMMON_HEADERS,
    });
    return response.data;
  },

  joinRoom: async (code: string): Promise<RoomDTO> => {
    const response = await axios.post(`${API_BASE_URL}/rooms/join/${code}`, {}, {
      headers: COMMON_HEADERS,
    });
    return response.data;
  },

  leaveRoom: async (code: string): Promise<void> => {
    await axios.post(`${API_BASE_URL}/rooms/leave/${code}`, {}, {
      headers: COMMON_HEADERS,
    });
  },

  getMyRooms: async (): Promise<RoomDTO[]> => {
    const response = await axios.get(`${API_BASE_URL}/rooms/my-rooms`, {
      headers: COMMON_HEADERS,
    });
    return response.data;
  }
};
