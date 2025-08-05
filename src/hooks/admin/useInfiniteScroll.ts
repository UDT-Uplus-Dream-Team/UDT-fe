'use client';

import { useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getUserList } from '@/lib/apis/admin/getUserList';
import { CursorPageResponse, User } from '@/types/admin/user';

export function useInfiniteUsers(keyword: string) {
  // 무한스크롤 트리거에 사용할 ref (Intersection Observer용)
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery<CursorPageResponse<User>, Error>({
      queryKey: ['userList', keyword],
      queryFn: ({ pageParam = null }) =>
        getUserList({
          cursor: pageParam as string | null,
          keyword,
          size: 20,
        }),
      initialPageParam: null,
      getNextPageParam: (lastPage) =>
        lastPage.hasNext ? lastPage.nextCursor : undefined,
      staleTime: 1000 * 60 * 5,
    });

  const users = data?.pages.flatMap((page) => page.item) ?? [];

  return {
    users,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    loadMoreRef,
  };
}
