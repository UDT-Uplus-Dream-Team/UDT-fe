import axiosInstance from '@lib/apis/axiosInstance';

// INVALID 상태의 배치 작업 삭제 api 호출하는 함수
export const deleteInvalidJobs = async (): Promise<void> => {
  await axiosInstance.delete('/api/admin/batch/invalid');
};
