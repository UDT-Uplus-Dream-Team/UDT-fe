import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postAdminCasts } from '@lib/apis/admin/postCasts';

/**
 * 출연진 다건 등록 훅
 */
export const usePostAdminCasts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postAdminCasts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['infiniteAdminCasts'] });
    },
  });
};
