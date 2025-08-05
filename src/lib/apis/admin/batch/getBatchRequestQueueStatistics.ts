import axiosInstance from '@lib/apis/axiosInstance';
import { BatchRequestQueueStatistics } from '@type/admin/batch';

// 배치 대기열 통계 조회 API
export const getBatchRequestQueueStatistics =
  async (): Promise<BatchRequestQueueStatistics> => {
    const { data } = await axiosInstance.get<BatchRequestQueueStatistics>(
      // TODO: 추후 수정 (알맞는 api 엔드포인트로..!)
      '/api/admin/batch/queue/metrics',
    );
    return data;
  };
