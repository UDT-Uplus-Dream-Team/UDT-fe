import { deleteContent } from '@lib/apis/admin/deleteContent';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showSimpleToast } from '@components/common/Toast';

// 콘텐츠 삭제를 처리하는 커스텀 훅
export const useDeleteContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contentId: number) => deleteContent(contentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['infiniteAdminContentList'] });
      showSimpleToast.success({
        message: '콘텐츠가 성공적으로 삭제되었습니다.',
        position: 'top-center',
      });
    },
  });
};
