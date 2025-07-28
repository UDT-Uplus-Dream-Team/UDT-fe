// src/hooks/recommend/useGetCuratedContents.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TicketComponent } from '@type/recommend/TicketComponent';
import { getCuratedContents } from '@lib/apis/recommend/getCuratedContents';
import type { CuratedContentsResponse } from '@lib/apis/recommend/getCuratedContents';
import { dummyMovies } from '@app/recommend/ContentList';

// 글로벌 timestamp 상태 (간단한 상태 관리)
let currentTimestamp = Date.now();

// timestamp를 업데이트하는 함수
export const generateNewCuratedContentKey = () => {
  currentTimestamp = Date.now();
  return currentTimestamp;
};

// 현재 timestamp 가져오기
export const getCurrentCuratedContentKey = () => currentTimestamp;

// 기존 Hook - 이제 timestamp가 포함된 queryKey 사용
export const useGetCuratedContents = () => {
  const queryResult = useQuery<TicketComponent[], Error>({
    queryKey: ['curatedContents', currentTimestamp],
    queryFn: fetchCuratedContentsWithFallback,

    staleTime: 1000 * 60 * 10, // 10분간 fresh 상태 유지
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
    currentKey: currentTimestamp,
  };
};

// 새로운 강제 refetch Hook - timestamp 업데이트 방식
export const useRefreshCuratedContents = () => {
  const queryClient = useQueryClient();

  const forceRefresh = async () => {
    try {
      console.log('강제 큐레이션 새로고침 시작...');

      // 1. 기존 모든 curatedContents 관련 쿼리 제거
      queryClient.removeQueries({
        queryKey: ['curatedContents'],
        exact: false, // 모든 timestamp 버전 제거
      });

      // 2. 새로운 timestamp 생성
      const newTimestamp = generateNewCuratedContentKey();
      console.log('새로운 쿼리 키 생성:', newTimestamp);

      // 3. 새로운 키로 데이터 fetch
      const newData = await queryClient.fetchQuery({
        queryKey: ['curatedContents', newTimestamp],
        queryFn: fetchCuratedContentsWithFallback,
      });

      console.log('강제 큐레이션 새로고침 완료:', newData);
      return newData;
    } catch (error) {
      console.error('강제 큐레이션 새로고침 실패:', error);
      throw error;
    }
  };

  return {
    forceRefresh,
    generateNewKey: generateNewCuratedContentKey,
    getCurrentKey: getCurrentCuratedContentKey,
  };
};

const fetchCuratedContentsWithFallback = async (): Promise<
  TicketComponent[]
> => {
  try {
    const timestamp = Date.now();
    console.log(`큐레이션 API 호출 시작 (${timestamp})`);

    const response: CuratedContentsResponse = await getCuratedContents();

    if (response.success && response.data && response.data.length > 0) {
      console.log(
        `큐레이션 API 성공 (${timestamp}): ${response.data.length}개 콘텐츠 로드`,
      );
      return response.data;
    }

    // API 성공했지만 데이터가 없는 경우
    console.warn(
      `큐레이션 데이터가 없어서 더미 데이터 사용 (${timestamp}):`,
      response.message,
    );
    return dummyMovies;
  } catch (error) {
    console.error('큐레이션 API 오류:', error);
    // API 실패 시 fallback으로 더미 데이터 반환
    return dummyMovies;
  }
};
