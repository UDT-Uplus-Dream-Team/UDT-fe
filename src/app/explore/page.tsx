'use client';

import { FilterRadioButtonGroup } from '@components/explore/FilterRadioButtonGroup';
import { ExplorePageCarousel } from '@/components/explore/ExplorePageCarousel';
import {
  ExplorePageProvider,
  ExplorePageContext,
} from '@contexts/ExplorePageContext';
import { MovieData } from '@/types/Moviedata';
import { useContext } from 'react';

// 탐색 페이지
function ExplorePageContent() {
  const context = useContext(ExplorePageContext);
  const { currentSelectedOptions } = context!;

  const handleCardClick = (movie: MovieData) => {
    console.log('카드 클릭됨:', movie.title);
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
    <div className="container flex flex-col items-center justify-start mx-auto p-6 space-y-6">
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
