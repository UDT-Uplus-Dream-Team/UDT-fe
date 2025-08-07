import { useMutation } from '@tanstack/react-query';
import { getRecommendationContents } from '@lib/apis/recommend/getRecommendationContents';
import { TicketComponent } from '@type/recommend/TicketComponent';

export const useFetchRecommendations = () => {
  return useMutation<TicketComponent[], Error, number>({
    mutationFn: (limit: number) => getRecommendationContents(limit),

    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),

    onSuccess: () => {},

    onError: () => {},

    meta: {
      description: '추천 콘텐츠 페칭 - 매번 새로운 결과',
    },
  });
};
