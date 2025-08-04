import { getDirectorsSearch } from '@lib/apis/admin/getDirectorsSearch';
import { AdminDirectorsGetRequest } from '@type/admin/Director';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useInfiniteDirectorsSearch = (
  initialParams: Omit<AdminDirectorsGetRequest, 'cursor'>,
) => {
  return useInfiniteQuery({
    queryKey: ['infiniteAdminDirectors', initialParams],
    queryFn: ({ pageParam = '' }) =>
      getDirectorsSearch({ ...initialParams, cursor: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    initialPageParam: '',
    enabled: !!initialParams.name,
  });
};
