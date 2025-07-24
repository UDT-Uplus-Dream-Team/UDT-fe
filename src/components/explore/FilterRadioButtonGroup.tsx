import { FilterRadioButton } from './FilterRadioButton';
import { FilterBottomSheetContent } from '@components/explore/FilterBottomSheetContent';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@components/ui/sheet';
import Image from 'next/image';
import {
  useExploreFilters,
  useExploreUI,
  useExploreTempFilters,
} from '@hooks/useExplorePageState';
import { useEffect, useRef, useState } from 'react';

// FilterRadioButton을 모아두는 그룹 컴포넌트
export const FilterRadioButtonGroup = () => {
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // 스크롤 위치 추적을 위한 state, Ref, 함수 정의
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragMoved, setDragMoved] = useState(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragMoved(false);
    dragStartX.current = e.pageX;
    dragScrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    const x = e.pageX;
    const walk = x - dragStartX.current;
    if (Math.abs(walk) > 5) setDragMoved(true);
    scrollRef.current.scrollLeft = dragScrollLeft.current - walk;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    setTimeout(() => setDragMoved(false), 100);
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  };

  const { appliedFilters, displayedOptionsInTop, toggleAppliedFilter } =
    useExploreFilters();
  const {
    isBottomSheetOpen,
    openBottomSheet,
    closeBottomSheet,
    applyTempFilters,
  } = useExploreUI();
  const { clearTempFilters, toggleTempFilter } = useExploreTempFilters();

  // 스크롤 위치 추적
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        rootMargin: '-1px 0px 0px 0px',
      },
    );

    const current = sentinelRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  // 필터 토글 핸들러
  const handleFilterToggle = (label: string) => {
    if (isBottomSheetOpen) {
      // BottomSheet가 열려있을 때는 temp 필터에만 추가/제거
      toggleTempFilter(label);
    } else {
      toggleAppliedFilter(label); // BottomSheet가 열려있지 않을 때는 바로 적용
    }
  };

  return (
    <>
      {/* Sentinel (sticky 시작 전 위치) */}
      <div ref={sentinelRef} className="h-0" />
      <div
        className={`sticky top-0 z-10 transition-colors duration-200 ease-in-out ${
          isSticky ? 'bg-primary-900' : 'bg-transparent'
        }`}
      >
        <div className="w-full">
          {/* 필터 버튼 그룹 */}
          {/* TODO: 추후 디자인 변경 시 padding값 수정 필요 */}
          <div className="pt-5 pb-4">
            <div
              ref={scrollRef}
              className="flex flex-row justify-start items-center gap-3 overflow-x-auto scrollbar-hide max-w-full overscroll-x-none px-6 select-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
              {/* 필터링 버튼 (누를 시 BottomSheet 표시) */}
              <Sheet
                open={isBottomSheetOpen}
                onOpenChange={(open) => {
                  if (open) {
                    openBottomSheet();
                  } else {
                    closeBottomSheet(); // X 버튼이나 외부 클릭 시 취소되는 action
                  }
                }}
              >
                <SheetTrigger asChild>
                  <button className="flex-shrink-0 p-1 flex items-center justify-center w-fit h-auto bg-primary-300/80 rounded-[8px] cursor-pointer">
                    <Image
                      src="/icons/tune-icon.svg"
                      alt="필터"
                      width={24}
                      height={24}
                    />
                  </button>
                </SheetTrigger>

                {/* Sheet 콘텐츠 (해당 콘텐츠는 FilterBottomSheetContent 컴포넌트로 구현) */}
                <SheetContent
                  side="bottom"
                  className="flex flex-col gap-0 h-[60vh] max-h-[60vh] bg-[#07033E] border-t-0 rounded-t-[20px]"
                >
                  {/* 표시되지 않는 Header (Screen Reader에서만 읽힘) */}
                  <SheetHeader className="p-0">
                    <SheetTitle className="sr-only h-0 p-0">필터</SheetTitle>
                  </SheetHeader>
                  {/* 헤더 영역 */}
                  <div className="flex items-center justify-center pt-5 p-4">
                    <span className="text-xl font-semibold text-white">
                      필터
                    </span>
                  </div>

                  {/* 스크롤 가능한 메인 콘텐츠 영역 */}
                  <div className="flex-1 overflow-y-auto scrollbar-hide">
                    <FilterBottomSheetContent />
                  </div>

                  {/* 하단 고정 버튼 영역 */}
                  <div className="flex flex-row items-center justify-center p-4 gap-12">
                    <button
                      className="flex items-center text-white text-sm hover:opacity-80 transition cursor-pointer"
                      onClick={clearTempFilters}
                    >
                      <Image
                        alt="reset"
                        width={12}
                        height={12}
                        src="/icons/reset-icon.svg"
                      />
                      <span className="pl-2">초기화</span>
                    </button>

                    <button
                      className="bg-primary-800 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-200 transition cursor-pointer"
                      onClick={applyTempFilters}
                    >
                      적용하기
                    </button>
                  </div>
                </SheetContent>
              </Sheet>

              {/* 필터 버튼 옆에는 각 옵션에 대한 라디오 버튼 표시 */}
              {displayedOptionsInTop.map((option) => (
                <FilterRadioButton
                  key={option}
                  label={option}
                  isSelected={appliedFilters.includes(option)}
                  onToggle={() => {
                    if (dragMoved) return; // 드래그 중이면 클릭 무시
                    handleFilterToggle(option);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
