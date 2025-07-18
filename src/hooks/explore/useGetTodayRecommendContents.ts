import { useQuery } from '@tanstack/react-query';
import { SimpleContentData } from '@type/explore/Explore';
import { getTodayContents } from '@lib/apis/explore/getTodayContents';

// 오늘의 OTT 콘텐츠 추천 목록 조회 API 호출하는 custom Hook
export const useGetTodayRecommendContents = (enabled: boolean) => {
  return useQuery<SimpleContentData[]>({
    queryKey: ['todayRecommendContents'],
    queryFn: getTodayContents,
    staleTime: 0, // 바로 stale
    enabled: enabled, // 해당 쿼리 호출 여부 결정
    gcTime: 0, // 캐시 즉시 삭제
    refetchOnWindowFocus: false, // UX 보호용
  });
};
