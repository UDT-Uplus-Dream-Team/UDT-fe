import { getCastsSearch } from '@lib/apis/admin/getCastsSearch';
import { AdminCastsGetRequest } from '@type/admin/Cast';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useInfiniteCastsSearch = (
  initialParams: Omit<AdminCastsGetRequest, 'cursor'>,
) => {
  return useInfiniteQuery({
    queryKey: ['infiniteAdminCasts', initialParams],
    queryFn: ({ pageParam = '' }) =>
      getCastsSearch({ ...initialParams, cursor: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    initialPageParam: '',
    enabled: !!initialParams.name,
  });
};
