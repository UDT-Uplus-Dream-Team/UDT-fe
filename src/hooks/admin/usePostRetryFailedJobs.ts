import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postRetryFailedJobs } from '@lib/apis/admin/batch/postRetryFailedJobs';
import { showSimpleToast } from '@components/common/Toast';

// 실패한 배치 목록 재시도 api 호출하는 커스텀 훅
export const usePostRetryFailedJobs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postRetryFailedJobs,
    onSuccess: () => {
      // 실패한 작업 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['batchJobList', 'FAILED'] });
      // 상단 통계도 새로고침
      queryClient.invalidateQueries({ queryKey: ['batchResultStatistics'] });
      // 배치 결과 테이블도 새로고침
      queryClient.invalidateQueries({ queryKey: ['batchResults'] });

      showSimpleToast.success({
        message: '배치 작업 재시도 완료',
      });
    },
    onError: () => {
      showSimpleToast.error({
        message: '배치 작업 재시도 실패',
      });
    },
  });
};
