import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showSimpleToast } from '@components/common/Toast';
import { postAdminCasts } from '@lib/apis/admin/postCasts';

/**
 * 출연진 다건 등록 훅
 */
export const usePostAdminCasts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postAdminCasts,
    onSuccess: (data) => {
      showSimpleToast.success({
        message: `${data.castIds.length}명의 출연진이 등록되었습니다.`,
        position: 'top-center',
      });

      queryClient.invalidateQueries({ queryKey: ['infiniteAdminCasts'] });
    },
    onError: () => {
      showSimpleToast.error({
        message: '출연진 등록에 실패했습니다.',
        position: 'top-center',
      });
    },
  });
};
