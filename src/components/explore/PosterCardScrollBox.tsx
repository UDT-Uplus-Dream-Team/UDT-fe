// 영화(PosterCard) 카드를 모아 놓은 스크롤 박스 컴포넌트
import { PosterCard } from './PosterCard';
import { useRef, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@components/ui/sheet';
import { DetailBottomSheetContent } from '@components/explore/DetailBottomSheetContent';
import { useGetContentListByBoxType } from '@hooks/explore/useGetContentListByBoxType';
import { FilterRadioButton } from '@components/explore/FilterRadioButton';
import { PosterScrollSkeleton } from '@components/explore/PosterScrollBoxSkeleton';

export interface PosterCardScrollBoxProps {
  BoxTitle: string;
  BoxType: 'popular' | 'todayRecommend';
}

// 포스터를 모아놓은 스크롤 박스 컴포넌트 (여기는 x축으로 왼쪽/오른쪽 스크롤 가능)
export const PosterCardScrollBox = ({
  BoxTitle,
  BoxType,
}: PosterCardScrollBoxProps) => {
  const [isDetailBottomSheetOpen, setIsDetailBottomSheetOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dragMoved, setDragMoved] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragMoved(false);

    // React에서 pointer event에 touches가 없을 수 있으니,
    // 터치와 마우스 모두 pageX만 사용 (pointerEvents는 통합 이벤트)
    dragStartX.current = e.pageX;
    dragScrollLeft.current = scrollRef.current?.scrollLeft ?? 0;

    // pointer capture로 안전하게 이 div가 포인터 이벤트 독점
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return; // <-- 누르고 있을 때만!
    const x = e.pageX;
    const walk = x - dragStartX.current;
    if (Math.abs(walk) > 5) setDragMoved(true);
    scrollRef.current.scrollLeft = dragScrollLeft.current - walk;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    setTimeout(() => setDragMoved(false), 100); // 클릭 무시 후 해제

    (e.target as Element).releasePointerCapture?.(e.pointerId);
  };

  const handlePointerLeave = () => {
    setIsDragging(false);
    setTimeout(() => setDragMoved(false), 100);
  };

  // 포스터 스크롤 박스 타입에 따라 콘텐츠 목록 조회 API 호출하는 custom Hook 호출
  const {
    data: contentData,
    status,
    refetch,
  } = useGetContentListByBoxType(BoxType);

  const handlePosterClick = (movieId: number) => {
    setSelectedMovieId(movieId);
    setIsDetailBottomSheetOpen(true);
  };

  const handleRefetch = () => {
    refetch();
  };

  // 로딩 중인 경우 (Skeleton UI 표시)
  if (status === 'pending') {
    return <PosterScrollSkeleton title={BoxTitle} count={8} />;
  }

  // 에러 상태 또는 데이터가 없는 경우
  if (status === 'error') {
    return (
      <div className="w-full h-fit flex flex-col justify-start items-start gap-2">
        <span className="text-xl text-white font-semibold py-2 ml-6">
          {BoxTitle}
        </span>
        <div className="w-full h-40 flex flex-col items-center justify-center gap-4 px-6">
          <span className="text-white text-lg text-center">
            오류가 발생했습니다.
          </span>
          <FilterRadioButton onToggle={handleRefetch} label="다시 불러오기" />
        </div>
      </div>
    );
  }

  // 로딩은 성공 했으나, 데이터가 없는 경우
  if (contentData.length === 0) {
    return (
      <div className="w-full h-fit flex flex-col justify-start items-start gap-2">
        <span className="text-xl text-white font-semibold py-2 ml-6">
          {BoxTitle}
        </span>
        <div className="w-full max-w-5xl mx-auto py-12 flex justify-center text-gray-300">
          표시할 콘텐츠가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-fit flex flex-col justify-start items-start gap-2">
      <span className="text-xl text-white font-semibold py-2 ml-6">
        {BoxTitle}
      </span>
      <div
        className="w-full h-fit flex flex-row gap-3 overflow-x-auto scrollbar-hide px-6 select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        ref={scrollRef}
      >
        {contentData.map((movie) => (
          <PosterCard
            key={movie.contentId}
            title={'타이틀없음'}
            image={movie.posterUrl}
            isTitleVisible={false}
            onClick={() => {
              if (dragMoved) return; // 드래그 중이면 무시
              handlePosterClick(movie.contentId);
            }}
          />
        ))}
      </div>

      {/* 영화 상세 정보 BottomSheet (필요 시 pop-up) */}
      <Sheet
        open={isDetailBottomSheetOpen}
        onOpenChange={setIsDetailBottomSheetOpen}
      >
        <SheetContent
          side="bottom"
          className="px-0 pb-5 h-[90vh] max-w-full rounded-t-2xl bg-primary-800 flex flex-col overflow-y-auto scrollbar-hide gap-0"
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
  );
};
