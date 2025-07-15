import { useExploreStore } from '@store/ExploreStore';
import { useQuery } from '@tanstack/react-query';
import { getFilteredContent } from '@lib/apis/getFilteredContent';
import { createRequestFilterBody } from '@utils/createFilterRequestBody';

// 적용된 필터가 변경될 때만 API 호출
export const useGetFilteredContent = () => {
  const appliedFilters = useExploreStore((state) => state.appliedFilters);

  return useQuery({
    queryKey: ['filteredContent', appliedFilters],
    queryFn: () => getFilteredContent(createRequestFilterBody(appliedFilters)),
    enabled: appliedFilters.length > 0,
    staleTime: 5 * 60 * 1000, // 5분
  });
};
