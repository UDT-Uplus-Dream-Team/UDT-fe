import { useQuery } from '@tanstack/react-query';
import { getContentDetail } from '@lib/apis/getContentDetail';
import { ContentDetail } from '@type/ContentDetail';

// 콘텐츠 상세 정보 가져오는 훅 (TanStack Query를 활용해서 필요 시 캐싱 정보 활용)
export const useGetContentDetail = (contentId: string) => {
  return useQuery<ContentDetail>({
    queryKey: ['contentDetail', contentId],
    queryFn: () => getContentDetail(contentId),
    staleTime: 1000 * 60 * 5, // 5분간 fresh
    enabled: !!contentId, // contentId가 있을 때만 실행
  });
};
