// 필터를 선택했을 시에 보여줄 카드 목록
'use client';

import { useRef, useEffect } from 'react';
import { SimpleContentData } from '@type/explore/Explore';
import { PosterCard } from '@components/explore/PosterCard';

interface PosterCardsGridProps {
  contents: SimpleContentData[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

// 필터 선택 시 표시할 그리드 방식 카드 목록 컴포넌트
export const PosterCardsGrid = ({
  contents,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: PosterCardsGridProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    // 무한 스크롤 처리를 위한 Intersection Observer 설정
    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [loadMoreRef.current, hasNextPage, isFetchingNextPage]);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 px-4 py-6">
      {contents.map((item, idx) => (
        <PosterCard
          key={idx}
          title={item.title}
          image={item.posterUrl}
          onClick={() => {}}
        />
      ))}

      {/* 로딩 중 표시 */}
      {isFetchingNextPage && (
        <div className="col-span-3 text-center py-4">불러오는 중...</div>
      )}

      {/* 무한스크롤 트리거용 빈 div */}
      <div ref={loadMoreRef} className="col-span-3 h-1" />
    </div>
  );
};
