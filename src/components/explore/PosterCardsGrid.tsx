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
import { X } from 'lucide-react';

interface PosterCardsGridProps {
  contents: SimpleContentData[];
  fetchNextPage: () => void;
  status: 'pending' | 'success' | 'error'; // 데이터 로딩 상태
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

// 필터 선택 시 표시할 그리드 방식 카드 목록 컴포넌트
export const PosterCardsGrid = ({
  contents,
  status,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: PosterCardsGridProps) => {
  const [isDetailBottomSheetOpen, setIsDetailBottomSheetOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handlePosterClick = (movieId: number) => {
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
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-5 px-4 py-6 mx-auto transition-opacity duration-300 justify-items-center">
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
                hideDefaultClose={true} // 기본 닫기 버튼 제거
                className="px-0 pb-5 h-[90svh] max-w-[640px] w-full mx-auto rounded-t-2xl bg-primary-800 flex flex-col overflow-y-auto scrollbar-hide gap-0 !border-none"
              >
                {/* 커스텀 X 버튼 (z-index로 위에 배치) */}
                <button
                  onClick={() => setIsDetailBottomSheetOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 z-50 flex items-center justify-center rounded-full bg-white/60 hover:bg-white/80 transition"
                  aria-label="닫기"
                >
                  <X className="w-4 h-4 text-gray-800" />
                </button>
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
        // 로딩 중인 것인지의 여부에 따라 나오는 텍스트가 달라야 함
        <div className="flex flex-1 flex-col items-center justify-center text-white">
          {status === 'pending' ? '불러오는 중...' : '검색 결과가 없습니다.'}
        </div>
      )}
    </>
  );
};
