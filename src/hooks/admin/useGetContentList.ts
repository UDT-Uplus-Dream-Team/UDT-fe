import { getContentList } from '@lib/apis/admin/getContentList';
import {
  AdminContentListParams,
  AdminContentListResponse,
} from '@type/admin/Content';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

// 기존: 관리자 콘텐츠 목록을 불러오는 훅
export const useAdminContentList = (params: AdminContentListParams) => {
  return useQuery<AdminContentListResponse>({
    queryKey: ['adminContentList', params],
    queryFn: () => getContentList(params),
  });
};

// 추가: 무한 스크롤용 훅
export const useInfiniteAdminContentList = (
  params: Omit<AdminContentListParams, 'cursor'>,
) => {
  return useInfiniteQuery<AdminContentListResponse>({
    queryKey: ['infiniteAdminContentList', params],
    queryFn: ({ pageParam = 0 }) => {
      const category =
        params.categoryType === 'all' ? null : params.categoryType;

      return getContentList({
        ...params,
        categoryType: category,
        cursor: pageParam as number,
      });
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? Number(lastPage.nextCursor) : undefined,
    initialPageParam: null,
  });
};
