import axiosInstance from './axiosInstance';
import { UserProfile } from '@/types/auth/UserProfile'; // 필요 시 경로 수정

export const authService = {
  /**
   * 현재 로그인한 사용자 정보 조회
   */
  getCurrentUser: async (): Promise<UserProfile> => {
    const response = await axiosInstance.get('/api/users/me');
    return response.data;
  },

  /**
   * 로그아웃 요청
   */
  logout: async (): Promise<void> => {
    await axiosInstance.post('/api/auth/logout');
  },
};
