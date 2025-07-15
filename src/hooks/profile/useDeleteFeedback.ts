import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFeedback } from '@lib/apis/profile/feedbackService';

export const useDeleteFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (feedbackId: number) => deleteFeedback(feedbackId),
    onSuccess: () => {
      // 삭제 성공 시 피드백 콘텐츠 리스트 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ['feedbackContents'] });
    },
  });
};
