import { postContent } from '@lib/apis/admin/postContent';
import { ContentWithoutId } from '@type/admin/Content';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showSimpleToast } from '@components/common/Toast';

// 콘텐츠 등록 훅
export const usePostContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ContentWithoutId) => postContent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['infiniteAdminContentList'] });
      showSimpleToast.success({
        message: '콘텐츠가 성공적으로 등록되었습니다.',
        position: 'top-center',
      });
    },
  });
};
