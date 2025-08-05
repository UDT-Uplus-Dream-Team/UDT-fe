import { deleteContent } from '@lib/apis/admin/deleteContent';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// 콘텐츠 삭제를 처리하는 커스텀 훅
export const useDeleteContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contentId: number) => deleteContent(contentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['infiniteAdminContentList'] });
    },
  });
};
