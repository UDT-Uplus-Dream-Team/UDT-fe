'use client';

import { FilterRadioButtonGroup } from '@components/explore/FilterRadioButtonGroup';
import { ExplorePageCarousel } from '@components/explore/ExplorePageCarousel';
import { PosterCardScrollBox } from '@components/explore/PosterCardScrollBox';
import {
  ExplorePageProvider,
  ExplorePageContext,
} from '@/store/ExplorePageContext';
import { ContentData } from '@type/explore/Explore';
import { useContext } from 'react';

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

// 탐색 페이지
function ExplorePageContent() {
  const context = useContext(ExplorePageContext);
  const { currentSelectedOptions } = context!;

  const handleCardClick = (content: ContentData) => {
    console.log('카드 클릭됨:', content.title);
    // 여기에 카드 클릭 시 처리 로직 추가 (예: 상세 페이지로 이동)
  };

  // 선택된 필터 옵션들을 useMovieData 훅의 filters 형태로 변환
  const filters =
    currentSelectedOptions.length > 0
      ? {
          platform: currentSelectedOptions.join(','), // 여러 플랫폼을 쉼표로 구분
        }
      : undefined;

  return (
    <div className="container flex flex-col items-center justify-start mx-auto py-6 space-y-6 scrollbar-hide">
      <span className="text-2xl font-semibold">작품 탐색하기</span>

      {/* 필터 그룹 컴포넌트 */}
      <FilterRadioButtonGroup />

      {/* Carousel을 통해서 맨 위에 큰 카드로 영화를 보여주는 섹션 */}
      <div className="w-full">
        <ExplorePageCarousel
          autoPlayInterval={3000} // 3초마다 자동 슬라이드
          onCardClick={handleCardClick}
          filters={filters}
        />
      </div>

      {/* 영화 카드 스크롤 박스 컴포넌트 */}
      <PosterCardScrollBox
        title="목요일엔 목적없이 아무거나!"
        SimpleMovieData={mockMovieData}
      />

      {/* 영화 카드 스크롤 박스 컴포넌트 */}
      <PosterCardScrollBox
        title="지금 🔥Hot🔥한 콘텐츠"
        SimpleMovieData={mockMovieData}
      />
    </div>
  );
}

export default function ExplorePage() {
  return (
    <ExplorePageProvider>
      <ExplorePageContent />
    </ExplorePageProvider>
  );
}
