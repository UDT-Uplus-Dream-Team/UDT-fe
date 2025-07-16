// import { useInfiniteQuery } from '@tanstack/react-query';
// import { getFilteredContents } from '@lib/apis/explore/getFilteredContents';
// import {
//   ContentSearchConditionDTO,
//   FilteredContentResponse,
// } from '@type/explore/FilteredContent';
// TODO: 시연 끝나면 정리해야 함
import { ContentSearchConditionDTO } from '@/types/explore/FilteredContent';
import { mockfilteredContentData } from '@utils/getMockContentData';

interface UseFilteredContentsProps {
  size?: number;
  filters: ContentSearchConditionDTO;
  enabled?: boolean;
}

// 필터링된 콘텐츠 목록 조회 후 무한 스크롤 처리를 위한 custom Hook
export const useGetFilteredContents = ({
  size = 10,
  filters,
  enabled = true,
}: UseFilteredContentsProps) => {
  // return useInfiniteQuery<FilteredContentResponse>({
  //   queryKey: ['filtered-contents', JSON.stringify(filters)],
  //   queryFn: ({ pageParam }) => {
  //     // pageParam을 안전하게 string | null로 변환
  //     const cursor = typeof pageParam === 'string' ? pageParam : null;

  //     return getFilteredContents({
  //       cursor,
  //       size,
  //       contentSearchConditionDTO: filters,
  //     });
  //   },
  //   initialPageParam: null,
  //   getNextPageParam: (lastPage) =>
  //     lastPage.hasNext ? lastPage.nextCursor : undefined,
  //   enabled: enabled && !!filters, // enabled가 true이고 filters가 정의되어 있을 때만 쿼리 활성화
  // });
  console.log(filters);
  // ✅ 임시 mock 데이터 fallback
  if (!enabled) {
    return {
      data: { pages: [{ item: [] }] },
      fetchNextPage: () => {},
      hasNextPage: false,
      isFetchingNextPage: false,
    };
  }

  // ✨ mock 데이터를 한 페이지 분량으로 반환
  return {
    data: { pages: [{ item: mockfilteredContentData.slice(0, size) }] },
    fetchNextPage: () => {},
    hasNextPage: false,
    isFetchingNextPage: false,
  };
};
