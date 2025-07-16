import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from '@/lib/apis/profile/userService';

export const useGetUserInfo = () => {
  return useQuery({
    queryKey: ['userInfo'],
    queryFn: getUserInfo,
    staleTime: Infinity, // 무한히 stale되지 않음 (즉, 재요청 안 함)
  });
};
