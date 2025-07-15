import { UserProfile } from '@type/auth/UserProfile';

export const authService = {
  // 현재 사용자 정보 조회 (백엔드가 role 포함해서 다 줌)
  getCurrentUser: async (): Promise<UserProfile> => {
    const response = await fetch('/api/users/me', {
      credentials: 'include', // 쿠키 포함
    });

    if (!response.ok) {
      throw new Error('사용자 정보를 가져올 수 없습니다');
    }

    return response.json();
  },
};
