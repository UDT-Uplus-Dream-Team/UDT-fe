import { useQuery } from '@tanstack/react-query';
import { SimpleContentData } from '@type/explore/Explore';
import { getPopularContents } from '@lib/apis/explore/getPopularContents';

// OTT 콘텐츠 인기 목록 조회 API 호출하는 custom Hook
export const useGetPopularContents = (enabled: boolean) => {
  return useQuery<SimpleContentData[]>({
    queryKey: ['popularContents'],
    queryFn: () => getPopularContents(10),
    staleTime: 0, // 바로 stale
    enabled: enabled, // 해당 쿼리 호출 여부 결정
    gcTime: 0, // 캐시 즉시 삭제
    refetchOnWindowFocus: false, // UX 보호용
  });
};
