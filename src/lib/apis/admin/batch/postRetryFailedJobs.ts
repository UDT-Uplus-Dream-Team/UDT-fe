import axiosInstance from '@lib/apis/axiosInstance';

// 실패한 배치 목록 재시도 API
export const postRetryFailedJobs = async (): Promise<void> => {
  // 해당 API로부터는 응답값이 없음
  await axiosInstance.post('/api/admin/batch');
};
