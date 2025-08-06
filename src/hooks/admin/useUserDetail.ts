import { getUserDetail } from '@/lib/apis/admin/getUserDetail';
import { useQuery } from '@tanstack/react-query';

export const useUserDetail = (userId: number, enabled = true) => {
  return useQuery({
    queryKey: ['userDetail', userId],
    queryFn: () => getUserDetail(userId),
    enabled,
    staleTime: 1000 * 60 * 5, // 5분 캐시
  });
};
