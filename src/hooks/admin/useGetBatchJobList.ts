import { useInfiniteQuery } from '@tanstack/react-query';
import { getBatchJobList } from '@lib/apis/admin/batch/getBatchJobList';
import { GetBatchJobListResponse } from '@type/admin/batch';

// 배치 예정 목록 조회 후 무한 스크롤 처리를 위한 custom Hook
export const useGetBatchJobList = ({
  type,
  size = 20,
  enabled = true,
}: {
  type: 'PENDING' | 'FAILED' | 'INVALID';
  size?: number;
  enabled?: boolean;
}) => {
  return useInfiniteQuery<GetBatchJobListResponse, Error>({
    queryKey: ['batchJobList', type],
    queryFn: async ({ pageParam }) => {
      // pageParam을 안전하게 string | null로 변환
      const cursor = typeof pageParam === 'string' ? pageParam : null;
      return getBatchJobList({
        cursor,
        size,
        type,
      });
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    staleTime: 1000 * 60,
    enabled: enabled && !!type, // enabled가 true이고 type이 정의되어 있을 때만 쿼리 활성화
  });
};
