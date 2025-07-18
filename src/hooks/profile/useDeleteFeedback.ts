import { deleteFeedback } from '@/lib/apis/profile/feedbackService';
import { FeedbackQueryParams } from '@type/profile/RecommendedContent';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteFeedback = (
  baseParams: Omit<FeedbackQueryParams, 'cursor'>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (feedbackId: number) => deleteFeedback(feedbackId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks', baseParams] });
    },
  });
};
