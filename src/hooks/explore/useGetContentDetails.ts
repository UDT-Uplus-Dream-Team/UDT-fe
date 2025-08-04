// lib/hooks/useContentDetails.ts
import { useQuery } from '@tanstack/react-query';
import { getContentDetails } from '@lib/apis/explore/getContentDetails';
import { DetailedContentData } from '@type/explore/Explore';

// 특정 content ID에 대한 상세 정보 조회 API 호출하는 custom Hook
export const useGetContentDetails = (contentId: number) => {
  return useQuery<DetailedContentData>({
    queryKey: ['contentDetails', contentId],
    queryFn: () => getContentDetails(contentId),
    staleTime: 0, // 즉시 stale
    gcTime: 0, // 캐시 유지 시간도 0
    refetchOnWindowFocus: false, // 포커스 시 재요청 방지
  });
};
