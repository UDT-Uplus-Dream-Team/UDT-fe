import { patchContent } from '@lib/apis/admin/patchContent';
import { ContentWithoutId } from '@type/admin/Content';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// 콘텐츠 수정을 처리하는 훅
export const useUpdateContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      contentId,
      data,
    }: {
      contentId: number;
      data: ContentWithoutId;
    }) => patchContent(contentId, data),
    onSuccess: (_data, variables) => {
      const { contentId } = variables;

      // 콘텐츠 목록 무효화
      queryClient.invalidateQueries({ queryKey: ['infiniteAdminContentList'] });

      // 콘텐츠 상세 정보도 무효화
      queryClient.invalidateQueries({
        queryKey: ['adminContentDetail', contentId],
      });
    },
  });
};
