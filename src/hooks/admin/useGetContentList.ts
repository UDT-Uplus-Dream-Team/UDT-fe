import { getContentList } from '@lib/apis/admin/getContentList';
import {
  AdminContentListParams,
  AdminContentListResponse,
} from '@type/admin/Content';
import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';

// 무한 스크롤용 훅
export const useInfiniteAdminContentList = (
  params: Omit<AdminContentListParams, 'cursor'>,
) => {
  return useInfiniteQuery<
    AdminContentListResponse, // TQueryFnData
    unknown, // TError
    InfiniteData<AdminContentListResponse>, // TData
    [string, typeof params], // TQueryKey
    string | null // TPageParam
  >({
    queryKey: ['infiniteAdminContentList', params],
    queryFn: ({ pageParam = null }) => {
      const category =
        params.categoryType === 'all' ? null : params.categoryType;

      return getContentList({
        ...params,
        categoryType: category,
        cursor: pageParam,
      });
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    initialPageParam: null,
  });
};
