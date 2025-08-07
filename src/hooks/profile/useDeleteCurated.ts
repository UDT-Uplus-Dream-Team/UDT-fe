import { deleteCuratedContents } from '@lib/apis/profile/recommendService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteCurated = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contentIds: number[]) => deleteCuratedContents(contentIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curatedContents'] });
    },
  });
};
