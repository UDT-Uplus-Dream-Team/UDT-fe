import { useMutation } from '@tanstack/react-query';
import { getRecommendationContents } from '@/lib/apis/recommend/getRecommendationContents';
import { TicketComponent } from '@/types/recommend/TicketComponent';

export const useFetchRecommendations = () => {
  return useMutation<TicketComponent[], Error, number>({
    mutationFn: (limit: number) => getRecommendationContents(limit),

    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),

    onSuccess: (data, limit) => {
      console.log(`추천 콘텐츠 ${data.length}개 로드 성공 (limit: ${limit})`);
    },

    onError: (error, limit) => {
      console.error(`추천 콘텐츠 로드 실패 (limit: ${limit}):`, error);
    },

    meta: {
      description: '추천 콘텐츠 페칭 - 매번 새로운 결과',
    },
  });
};
