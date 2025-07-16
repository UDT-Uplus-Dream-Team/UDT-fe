'use client';

import { FilterRadioButtonGroup } from '@components/explore/FilterRadioButtonGroup';
import { ExplorePageCarousel } from '@components/explore/ExplorePageCarousel';
import { createFilterRequestParam } from '@utils/createFilterRequestParam';
import { PosterCardsGrid } from '@components/explore/PosterCardsGrid';
// TODO: api 연동 완료 후 주석 해제
import { useGetFilteredContents } from '@hooks/explore/useGetFilteredContents';

import {
  useExploreFilters,
  useExploreInitializer,
} from '@/hooks/useExplorePageState';
import { PosterCardScrollBox } from '@/components/explore/PosterCardScrollBox';

export default function ExplorePage() {
  // 초기화 (필터 옵션 로드)
  useExploreInitializer();

  // 필터 상태 구독
  const { appliedFilters } = useExploreFilters();

  // 필터 상태 변환
  const filters = appliedFilters.length > 0 ? appliedFilters : undefined;

  // 필터링된 콘텐츠 목록 조회 (필터 옵션을 이용해서 request param 생성해서 데이터를 받아온다, filter 비어 있으면 수행 X)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetFilteredContents({
      size: 12,
      filters: createFilterRequestParam(filters ?? []),
      enabled: filters !== undefined,
    });

  const handleCardClick = (contentId: number) => {
    console.log('카드 클릭됨. 카드 id', contentId);
  };

  // 필터링된 콘텐츠 목록 데이터 추출
  const contents = data?.pages.flatMap((page) => page.item) || [];

  return (
    <div className="flex flex-col min-h-screen overflow-y-auto">
      {/* 상단 제목 영역 */}
      <div className="flex items-center justify-center pt-6 pb-2">
        <span className="text-2xl font-semibold text-white">작품 탐색하기</span>
      </div>

      {/* 필터 그룹 - 스크롤 시 상단에 고정 */}
      <div className="sticky top-0 z-10">
        <div className="py-4">
          <FilterRadioButtonGroup />
        </div>
      </div>

      {
        // 필터가 적용된 경우
        filters !== undefined ? (
          <PosterCardsGrid
            contents={contents}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage ?? false}
            isFetchingNextPage={isFetchingNextPage}
          />
        ) : (
          // 스크롤 가능한 콘텐츠 영역
          <div className="flex-1 container mx-auto space-y-6 pt-4 pb-24">
            <div className="w-full">
              <ExplorePageCarousel
                autoPlayInterval={3000}
                onCardClick={handleCardClick}
              />
            </div>

            <PosterCardScrollBox BoxTitle="목요일엔 목적없이 아무거나!" />
            <PosterCardScrollBox BoxTitle="지금 🔥Hot🔥한 콘텐츠" />
          </div>
        )
      }
    </div>
  );
}
