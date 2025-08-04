import { deleteFeedback } from '@/lib/apis/profile/feedbackService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (feedbackId: number[]) => deleteFeedback(feedbackId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
    },
  });
};
