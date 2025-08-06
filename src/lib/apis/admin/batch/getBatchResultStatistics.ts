import axiosInstance from '@lib/apis/axiosInstance';
import { BatchResultStatistics } from '@type/admin/batch';

// 배치 결과 목록 조회 API
export const getBatchResultStatistics =
  async (): Promise<BatchResultStatistics> => {
    const { data } = await axiosInstance.get<BatchResultStatistics>(
      '/api/admin/batch/metrics',
    );
    return data;
  };
