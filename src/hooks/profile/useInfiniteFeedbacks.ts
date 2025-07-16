import { useInfiniteQuery } from '@tanstack/react-query';

import type {
  FeedbackQueryParams,
  GetFeedbackContentsResponse,
} from '@type/mypage/RecommendedContent';
import { getFeedbackContents } from '@/lib/apis/profile/feedbackService';

export const useInfiniteFeedbacks = (
  baseParams: Omit<FeedbackQueryParams, 'cursor'>,
) => {
  return useInfiniteQuery<GetFeedbackContentsResponse, Error>({
    queryKey: ['feedbacks', baseParams],
    queryFn: ({ pageParam = 0 }) =>
      getFeedbackContents({
        cursor: pageParam as number,
        ...baseParams,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
    initialPageParam: 0,
  });
};
