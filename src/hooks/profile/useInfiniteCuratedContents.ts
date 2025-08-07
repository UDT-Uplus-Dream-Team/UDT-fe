import { getCuratedContents } from '@lib/apis/profile/recommendService';
import { useInfiniteQuery } from '@tanstack/react-query';
import type {
  GetRecommendedContentsResponse,
  RecommendedQueryParams,
} from '@type/profile/RecommendedContent';

export const useInfiniteCuratedContents = (
  baseParams: Omit<RecommendedQueryParams, 'cursor'>,
) => {
  return useInfiniteQuery<GetRecommendedContentsResponse, Error>({
    queryKey: ['curatedContents', baseParams],
    queryFn: ({ pageParam = null }) =>
      getCuratedContents({
        cursor: pageParam as number | null,
        ...baseParams,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
    initialPageParam: null,
  });
};
