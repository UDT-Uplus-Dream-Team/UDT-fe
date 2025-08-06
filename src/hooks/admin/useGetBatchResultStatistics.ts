// src/hooks/admin/useBatchResultStatistics.ts
import { useQuery } from '@tanstack/react-query';
import { getBatchResultStatistics } from '@lib/apis/admin/batch/getBatchResultStatistics';
import { BatchResultStatistics } from '@type/admin/batch';

// "배치 결과" 통계 조회 훅
export function useGetBatchResultStatistics() {
  return useQuery<BatchResultStatistics>({
    queryKey: ['batchResultStatistics'],
    queryFn: getBatchResultStatistics,
    staleTime: 1000 * 60, // 1분 동안 fresh 처리
    retry: 3, // 3번 재시도
  });
}
