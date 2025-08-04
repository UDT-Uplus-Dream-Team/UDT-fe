import axiosInstance from '@lib/apis/axiosInstance';
import { BatchResult } from '@type/admin/batch';

// 배치 결과 목록 조회 API
export const getBatchResults = async (): Promise<BatchResult[]> => {
  const { data } = await axiosInstance.get<BatchResult[]>(
    '/api/admin/batch/results',
  );
  return data;
};
