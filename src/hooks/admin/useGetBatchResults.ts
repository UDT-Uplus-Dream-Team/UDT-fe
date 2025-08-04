import { useQuery } from '@tanstack/react-query';
import { getBatchResults } from '@lib/apis/admin/batch/getBatchResults';
import { BatchResult } from '@type/admin/batch';

// 배치 결과 목록 조회 훅 (Tanstack Query 사용)
export const useBatchResults = () => {
  return useQuery<BatchResult[], Error>({
    queryKey: ['admin', 'batch', 'results'],
    queryFn: getBatchResults,
    retry: 2, // 기본 3회 → 필요에 따라 조정
    staleTime: 1000 * 60, // 1분 동안 fresh
  });
};
