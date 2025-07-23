import { useQuery } from '@tanstack/react-query';
import { RecentContentData } from '@type/explore/Explore';
import { getLatestContents } from '@lib/apis/explore/getLatestContents';

// OTT 콘텐츠 인기 목록 조회 API 호출하는 custom Hook
export const useGetLatestContents = () => {
  return useQuery<RecentContentData[]>({
    queryKey: ['latestContents'],
    queryFn: () => getLatestContents(10),
    staleTime: 0, // 바로 stale
    gcTime: 0, // 캐시 즉시 삭제
    refetchOnWindowFocus: false, // UX 보호용
    retry: 2, // 자동 재시도(최대 2번까지)
    retryDelay: 1000, // 재시도 딜레이(1초)
  });
};
