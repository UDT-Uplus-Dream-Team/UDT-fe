import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteInvalidJobs } from '@lib/apis/admin/batch/deleteInvalidJobs';
import { showSimpleToast } from '@components/common/Toast';

// INVALID 상태의 배치 작업 삭제 api 호출하는 함수
export function useDeleteInvalidJobs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInvalidJobs,
    onSuccess: () => {
      // 삭제 성공 시, 목록 쿼리 무효화(새로고침)
      queryClient.invalidateQueries({ queryKey: ['batchJobs'] });
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
