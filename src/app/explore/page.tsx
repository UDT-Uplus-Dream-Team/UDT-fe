'use client';

import { FilterRadioButtonGroup } from '@components/explore/FilterRadioButtonGroup';
import { Carousel } from '@components/explore/Carousel';
import { ExplorePageProvider } from '@contexts/ExplorePageContext';
import { useMovieData } from '@/hooks/useMovieData';
import { MovieData } from '@/types/Moviedata';
import { Loader2, RefreshCw } from 'lucide-react';

// 탐색 페이지
export default function ExplorePage() {
  const { movies, loading, error, refetch } = useMovieData();

  const handleCardClick = (movie: MovieData) => {
    console.log('카드 클릭됨:', movie.title);
    // 여기에 카드 클릭 시 처리 로직 추가 (예: 상세 페이지로 이동)
  };

  return (
    <ExplorePageProvider>
      <div className="container flex flex-col items-center justify-start mx-auto p-6 space-y-6">
        <span className="text-2xl font-semibold">작품 탐색하기</span>

        {/* 필터 그룹 컴포넌트 */}
        <FilterRadioButtonGroup />

        {/* Carousel을 통해서 맨 위에 큰 카드로 영화를 보여주는 섹션 */}
        <div className="w-full">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-gray-600">영화 데이터를 불러오는 중...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <p className="text-red-500 text-center">{error}</p>
              <button
                onClick={refetch}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>다시 시도</span>
              </button>
            </div>
          )}

          {!loading && !error && movies.length > 0 && (
            <div className="w-full">
              <Carousel
                movies={movies}
                autoPlayInterval={3000} // 3초마다 자동 슬라이드
                onCardClick={handleCardClick}
              />
            </div>
          )}

          {!loading && !error && movies.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500">표시할 영화가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </ExplorePageProvider>
  );
}
