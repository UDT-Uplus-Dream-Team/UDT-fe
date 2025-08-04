import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showSimpleToast } from '@components/common/Toast';
import { postAdminDirectors } from '@lib/apis/admin/postDirectors';

/**
 * 감독 다건 등록 훅
 */
export const usePostAdminDirectors = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postAdminDirectors,
    onSuccess: (data) => {
      showSimpleToast.success({
        message: `${data.directorIds.length}명의 감독이 등록되었습니다.`,
        position: 'top-center',
      });

      queryClient.invalidateQueries({ queryKey: ['infiniteAdminDirectors'] });
    },
    onError: () => {
      showSimpleToast.error({
        message: '감독 등록에 실패했습니다.',
        position: 'top-center',
      });
    },
  });
};
