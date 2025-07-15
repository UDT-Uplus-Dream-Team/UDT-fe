'use client';

import { FilterRadioButtonGroup } from '@components/explore/FilterRadioButtonGroup';
import { ExplorePageCarousel } from '@components/explore/ExplorePageCarousel';
import { PosterCardScrollBox } from '@components/explore/PosterCardScrollBox';
import { ContentData } from '@type/explore/Explore';
import {
  useExploreFilters,
  useExploreInitializer,
} from '@/hooks/useExplorePageState';

// TODO: api 연동 완료 후 주석 해제
// import { useGetFilteredContent } from '@/hooks/useGetFilteredContent';

// Mock 데이터 - 실제 네트워크 통신으로 받아온 정보로 대체될 예정
const mockMovieData = [
  {
    id: 1,
    title: '인터스텔라',
    image: '/images/poster1.webp',
  },
  {
    id: 2,
    title: '듄: 파트 2',
    image: '/images/poster2.webp',
  },
  {
    id: 3,
    title: '데드풀 & 울버린',
    image: '/images/poster3.webp',
  },
  {
    id: 4,
    title: '미션 임파서블: 데드 레코닝',
    image: '/images/poster1.webp',
  },
  {
    id: 5,
    title: '오펜하이머',
    image: '/images/poster2.webp',
  },
  {
    id: 6,
    title: '바비',
    image: '/images/poster3.webp',
  },
  {
    id: 7,
    title: '집가고싶다',
    image: '/images/poster3.webp',
  },
];

export default function ExplorePage() {
  // 초기화 (필터 옵션 로드)
  useExploreInitializer();

  // 필터 상태 구독
  const { appliedFilters } = useExploreFilters();

  const handleCardClick = (content: ContentData) => {
    console.log('카드 클릭됨:', content.title);
  };

  const filters =
    appliedFilters.length > 0
      ? { platform: appliedFilters.join(',') }
      : undefined;

  return (
    <div className="flex flex-col min-h-screen bg-primary-800 overflow-y-auto">
      {/* 상단 제목 영역 */}
      <div className="flex items-center justify-center pt-6 pb-2">
        <span className="text-2xl font-semibold text-white">작품 탐색하기</span>
      </div>

      {/* 필터 그룹 - 스크롤 시 상단에 고정 */}
      <div className="sticky top-0 z-10 bg-primary-800">
        <div className="py-4">
          <FilterRadioButtonGroup />
        </div>
      </div>

      {/* 스크롤 가능한 콘텐츠 영역 */}
      <div className="flex-1 container mx-auto space-y-6 pt-4 pb-24">
        <div className="w-full">
          <ExplorePageCarousel
            autoPlayInterval={3000}
            onCardClick={handleCardClick}
            filters={filters}
          />
        </div>

        <PosterCardScrollBox
          title="목요일엔 목적없이 아무거나!"
          SimpleMovieData={mockMovieData}
        />

        <PosterCardScrollBox
          title="지금 🔥Hot🔥한 콘텐츠"
          SimpleMovieData={mockMovieData}
        />
      </div>
    </div>
  );
}
