import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postAdminDirectors } from '@lib/apis/admin/postDirectors';

/**
 * 감독 다건 등록 훅
 */
export const usePostAdminDirectors = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postAdminDirectors,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['infiniteAdminDirectors'] });
    },
  });
};
