import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteInvalidJobs } from '@lib/apis/admin/batch/deleteInvalidJobs';
import { showSimpleToast } from '@components/common/Toast';

// INVALID 상태의 배치 작업 삭제 api 호출하는 함수
export function useDeleteInvalidJobs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInvalidJobs,
    onSuccess: () => {
      // 무효한 작업 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['batchJobList', 'INVALID'] });
      // 상단 통계도 새로고침
      queryClient.invalidateQueries({ queryKey: ['batchResultStatistics'] });
      // 배치 결과 테이블도 새로고침
      queryClient.invalidateQueries({ queryKey: ['batchResults'] });

      showSimpleToast.success({
        message: '배치 작업 삭제 완료',
      });
    },
    onError: () => {
      showSimpleToast.error({
        message: '배치 작업 삭제 실패',
      });
    },
  });
}
