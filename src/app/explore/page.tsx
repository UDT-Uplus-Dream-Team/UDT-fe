'use client';

import { FilterRadioButtonGroup } from '@components/explore/FilterRadioButtonGroup';
import { RepresentativeContentCard } from '@components/explore/RepresentativeContentCard';
import { ExplorePageProvider } from '@contexts/ExplorePageContext';

// 테스트용 더미 데이터 (나중에 삭제할 예정)
const dummyMovie = {
  contentId: 1,
  title: '인터스텔라',
  description: '우주를 배경으로 한 SF 영화',
  posterUrl: '/images/poster1.webp',
  backdropUrl: '/images/poster1.webp',
  openDate: '2014-11-06',
  runtimeTime: 169,
  rating: '12세이상관람가',
  categories: ['SF', '드라마'],
  genres: ['SF', '드라마', '모험', '스릴러'],
  directors: ['크리스토퍼 놀란'],
  platforms: ['넷플릭스', '티빙'],
};

// 탐색 페이지
export default function ExplorePage() {
  return (
    <ExplorePageProvider>
      <div className="container flex flex-col items-center justify-start mx-auto p-6 space-y-6">
        <span className="text-2xl font-semibold">작품 탐색하기</span>

        {/* 필터 그룹 컴포넌트 */}
        <FilterRadioButtonGroup />

        {/* RepresentativeContentCard 테스트 */}
        <div className="flex justify-center w-full px-4">
          <RepresentativeContentCard
            movie={dummyMovie}
            onClick={() => console.log('카드 클릭됨')}
          />
        </div>
      </div>
    </ExplorePageProvider>
  );
}
