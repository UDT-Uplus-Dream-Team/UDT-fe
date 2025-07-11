'use client';

import { FilterRadioButtonGroup } from '@components/explore/FilterRadioButtonGroup';
import { ExplorePageProvider } from '@contexts/ExplorePageContext';

// 탐색 페이지
export default function ExplorePage() {
  return (
    <ExplorePageProvider>
      <div className="container flex flex-col items-center justify-start mx-auto p-6 space-y-6">
        <span className="text-2xl font-semibold">작품 탐색하기</span>

        {/* 필터 그룹 컴포넌트 */}
        <FilterRadioButtonGroup />
      </div>
    </ExplorePageProvider>
  );
}
