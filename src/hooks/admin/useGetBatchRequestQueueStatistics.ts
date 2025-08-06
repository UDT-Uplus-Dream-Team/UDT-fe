// src/hooks/admin/useBatchResultStatistics.ts
import { useQuery } from '@tanstack/react-query';
import { getBatchRequestQueueStatistics } from '@/lib/apis/admin/batch/getBatchRequestQueueStatistics';
import { BatchRequestQueueStatistics } from '@type/admin/batch';

// "배치 대기열" 통계 조회 훅
export function useGetBatchRequestQueueStatistics() {
  return useQuery<BatchRequestQueueStatistics>({
    queryKey: ['batchRequestQueueStatistics'],
    queryFn: getBatchRequestQueueStatistics,
    staleTime: 1000 * 60, // 1분 동안 fresh 처리
    retry: 3, // 3번 재시도
  });
}
