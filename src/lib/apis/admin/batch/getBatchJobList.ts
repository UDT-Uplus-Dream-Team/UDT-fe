import axiosInstance from '@lib/apis/axiosInstance';
import {
  GetBatchJobListParams,
  GetBatchJobListResponse,
} from '@type/admin/batch';

// 배치 예정 목록 조회 api 호출하는 함수 (실패한 항목 목록 조회하는 것 포함)
export const getBatchJobList = async (
  params: GetBatchJobListParams,
): Promise<GetBatchJobListResponse> => {
  const { data } = await axiosInstance.get<GetBatchJobListResponse>(
    '/api/admin/batch',
    { params },
  );
  return data;
};
