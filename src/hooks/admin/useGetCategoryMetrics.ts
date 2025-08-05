import { getCategoryMetrics } from '@lib/apis/admin/getCategoryMetrics';
import { useQuery } from '@tanstack/react-query';

/**
 * 콘텐츠 카테고리별 지표 조회 훅
 */
export const useGetCategoryMetrics = () => {
  return useQuery({
    queryKey: ['categoryMetrics'],
    queryFn: getCategoryMetrics,
  });
};
