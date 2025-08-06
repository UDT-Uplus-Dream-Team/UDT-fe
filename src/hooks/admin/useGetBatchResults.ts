import { useInfiniteQuery } from '@tanstack/react-query';
import { getBatchResults } from '@lib/apis/admin/batch/getBatchResults';
import { BatchResult } from '@type/admin/batch';

// 배치 결과 목록 조회 훅 (Tanstack Query 사용)
export const useBatchResults = (size = 10) => {
  return useInfiniteQuery<
    {
      results: BatchResult[];
      nextCursor: string | null;
    },
    Error
  >({
    queryKey: ['batchResults'], // 쿼리 키 설정
    queryFn: async ({ pageParam }) => {
      // pageParam을 안전하게 string | null로 변환
      const cursor = typeof pageParam === 'string' ? pageParam : null;
      return getBatchResults({ cursor, size });
    },
    initialPageParam: null, // 첫 호출은 null 커서로 시작
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 60, // 1분 동안 fresh
    retry: 2, // 2번 재시도
  });
};
