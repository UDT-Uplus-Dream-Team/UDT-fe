import { useSuspenseQuery } from '@tanstack/react-query';
import { SimpleContentData } from '@type/explore/Explore';
import { getLatestContents } from '@lib/apis/explore/getLatestContents';

// OTT 콘텐츠 인기 목록 조회 API 호출하는 custom Hook
export const useGetLatestContents = () => {
  return useSuspenseQuery<SimpleContentData[]>({
    queryKey: ['latestContents'],
    queryFn: getLatestContents,
    staleTime: 0, // 바로 stale
    gcTime: 0, // 캐시 즉시 삭제
    refetchOnWindowFocus: false, // UX 보호용
  });
};
