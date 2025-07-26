// 필터를 선택했을 시에 보여줄 카드 목록
'use client';

import { useRef, useEffect, useState } from 'react';
import { SimpleContentData } from '@type/explore/Explore';
import { PosterCard } from '@components/explore/PosterCard';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@components/ui/sheet';
import { DetailBottomSheetContent } from '@components/explore/DetailBottomSheetContent';

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
  const [isDetailBottomSheetOpen, setIsDetailBottomSheetOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handlePosterClick = (movieId: number) => {
    //TODO: 이것을 네트워크 통신으로 대체해야 함
    setSelectedMovieId(movieId);
    setIsDetailBottomSheetOpen(true);
  };

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
    <>
      {contents.length > 0 ? (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-5 px-4 py-6 mx-auto transition-opacity duration-300">
            {contents.map((item, idx) => (
              <PosterCard
                key={idx}
                title={item.title}
                image={item.posterUrl}
                onClick={() => handlePosterClick(item.contentId)}
              />
            ))}

            {/* 무한스크롤 트리거용 빈 div */}
            <div ref={loadMoreRef} className="col-span-3 h-1" />

            {/* 영화 상세 정보 BottomSheet (필요 시 pop-up) */}
            <Sheet
              open={isDetailBottomSheetOpen}
              onOpenChange={setIsDetailBottomSheetOpen}
            >
              <SheetContent
                side="bottom"
                className="px-0 pb-5 h-[90vh] max-w-[640px] w-full mx-auto rounded-t-2xl bg-primary-800 flex flex-col overflow-y-auto scrollbar-hide gap-0"
              >
                {/* 표시되지 않는 Header (Screen Reader에서만 읽힘) */}
                <SheetHeader className="p-0">
                  <SheetTitle className="sr-only h-0 p-0">상세정보</SheetTitle>
                </SheetHeader>
                {selectedMovieId && (
                  <DetailBottomSheetContent contentId={selectedMovieId} />
                )}
              </SheetContent>
            </Sheet>
          </div>
          {/* 로딩 중 표시 */}
          {isFetchingNextPage && (
            <div className="col-span-3 text-center py-4">불러오는 중...</div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white">
          검색 결과가 없습니다.
        </div>
      )}
    </>
  );
};
