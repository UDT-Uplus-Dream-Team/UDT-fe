import { useInfiniteQuery } from '@tanstack/react-query';

import type {
  FeedbackQueryParams,
  GetFeedbackContentsResponse,
} from '@type/profile/FeedbackContent';
import { getFeedbackContents } from '@lib/apis/profile/feedbackService';

export const useInfiniteFeedbacks = (
  baseParams: Omit<FeedbackQueryParams, 'cursor'>,
) => {
  return useInfiniteQuery<GetFeedbackContentsResponse, Error>({
    queryKey: [
      'feedbacks',
      baseParams.feedbackType,
      baseParams.feedbackSortType,
    ],
    queryFn: ({ pageParam = null }) =>
      getFeedbackContents({
        cursor: pageParam as number | null,
        ...baseParams,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
    initialPageParam: null,
  });
};
