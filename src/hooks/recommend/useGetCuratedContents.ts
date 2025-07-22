// src/hooks/recommend/useGetCuratedContents.ts
import { useQuery } from '@tanstack/react-query';
import { TicketComponent } from '@type/recommend/TicketComponent';
import { getCuratedContents } from '@lib/apis/recommend/getCuratedContents';
import { dummyMovies } from '@app/recommend/ContentList';

export const useGetCuratedContents = () => {
  return useQuery<TicketComponent[], Error>({
    queryKey: ['curatedContents'],
    queryFn: fetchCuratedContentsWithFallback,

    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 10, // 10분 후 자동 정리

    refetchOnMount: false, // 컴포넌트 재마운트해도 refetch 안 함
    refetchOnWindowFocus: false, // 탭 전환해도 refetch 안 함
    refetchOnReconnect: false, // 네트워크 재연결해도 refetch 안 함
    refetchInterval: false, // 주기적 refetch 안 함

    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    throwOnError: false,
  });
};

interface CuratedContentsResponse {
  success: boolean;
  data: TicketComponent[];
  message?: string;
}

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
