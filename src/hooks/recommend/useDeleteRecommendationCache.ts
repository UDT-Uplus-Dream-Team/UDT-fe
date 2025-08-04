import { useMutation } from '@tanstack/react-query';
import { deleteRecommendationCache } from '@lib/apis/recommend/deleteRecommendationCache';

export const useDeleteRecommendationCache = () => {
  return useMutation({
    mutationFn: deleteRecommendationCache,
  });
};
