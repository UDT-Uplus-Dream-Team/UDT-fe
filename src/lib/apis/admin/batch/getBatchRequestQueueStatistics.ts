import axiosInstance from '@lib/apis/axiosInstance';
import { BatchRequestQueueStatistics } from '@type/admin/batch';

// 배치 대기열 통계 조회 API
export const getBatchRequestQueueStatistics =
  async (): Promise<BatchRequestQueueStatistics> => {
    const { data } = await axiosInstance.get<BatchRequestQueueStatistics>(
      '/api/admin/batch/metrics/reservation',
    );
    return data;
  };
