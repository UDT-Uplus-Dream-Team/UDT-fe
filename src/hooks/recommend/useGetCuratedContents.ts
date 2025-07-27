// src/hooks/recommend/useGetCuratedContents.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TicketComponent } from '@type/recommend/TicketComponent';
import { getCuratedContents } from '@lib/apis/recommend/getCuratedContents';
import type { CuratedContentsResponse } from '@lib/apis/recommend/getCuratedContents';
import { dummyMovies } from '@app/recommend/ContentList';

// 기존 Hook은 그대로 유지
export const useGetCuratedContents = () => {
  const queryResult = useQuery<TicketComponent[], Error>({
    queryKey: ['curatedContents'],
    queryFn: fetchCuratedContentsWithFallback,

    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 10, // 10분 후 자동 정리

    refetchOnMount: false, // 컴포넌트 재마운트해도 refetch 안 함
    refetchOnWindowFocus: false, // 탭 전환해도 refetch 안 함
    refetchInterval: false, // 주기적 refetch 안 함

    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    throwOnError: false,
  });

  return {
    ...queryResult,
    // refetch 함수를 명시적으로 노출
    refetchCuratedContents: queryResult.refetch,
  };
};

// 새로운 강제 refetch Hook 추가
export const useRefreshCuratedContents = () => {
  const queryClient = useQueryClient();

  const forceRefresh = async () => {
    try {
      console.log('강제 큐레이션 새로고침 시작...');

      // 1. 기존 캐시 완전 제거
      queryClient.removeQueries({ queryKey: ['curatedContents'] });

      // 2. 새로운 데이터 fetch
      const newData = await queryClient.fetchQuery({
        queryKey: ['curatedContents'],
        queryFn: fetchCuratedContentsWithFallback,
        staleTime: 0, // 즉시 stale
      });

      console.log('강제 큐레이션 새로고침 완료:', newData);
      return newData;
    } catch (error) {
      console.error('강제 큐레이션 새로고침 실패:', error);
      throw error;
    }
  };

  return { forceRefresh };
};

const fetchCuratedContentsWithFallback = async (): Promise<
  TicketComponent[]
> => {
  try {
    const response: CuratedContentsResponse = await getCuratedContents();

    if (response.success && response.data && response.data.length > 0) {
      console.log(`큐레이션 API 성공: ${response.data.length}개 콘텐츠 로드`);
      return response.data;
    }

    // API 성공했지만 데이터가 없는 경우
    console.warn(
      '큐레이션 데이터가 없어서 더미 데이터 사용:',
      response.message,
    );
    return dummyMovies;
  } catch (error) {
    console.error('큐레이션 API 오류:', error);
    // API 실패 시 fallback으로 더미 데이터 반환
    return dummyMovies;
  }
};
