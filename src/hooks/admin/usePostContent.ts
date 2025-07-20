import { postContent } from '@lib/apis/admin/postContent';
import { ContentWithoutId } from '@type/admin/Content';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// 콘텐츠 등록 훅
export const usePostContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ContentWithoutId) => postContent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminContentList'] });
    },
  });
};
