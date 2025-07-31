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
import { X } from 'lucide-react';

// FilterRadioButton을 모아두는 그룹 컴포넌트
export const FilterRadioButtonGroup = () => {
  // 스크롤 위치 추적을 위한 state, Ref, 함수 정의
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false); // 현재 스크롤 위치에 따라 sticky 상태 감지
  const [isDragging, setIsDragging] = useState(false);
  const [dragMoved, setDragMoved] = useState(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);

  // sticky 상태를 감지하기 위해 사용하는 코드
  useEffect(() => {
    // sticky 바로 위에 삽입해서, 해당 element가 화면에 보이지 않으면 sticky 발동
    const sentinel = document.createElement('div');
    stickyRef.current?.parentNode?.insertBefore(sentinel, stickyRef.current);

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      {
        root: null, // window 기준으로 뷰포트 범위 내에서 확인
        threshold: 0,
      },
    );
    observer.observe(sentinel);
    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, []);

  // 포인터 옵션 관련 핸들러
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

  // 필터 관련 상태 및 함수 추출 (Zustand를 사용한 상태 관리 훅에서 가져옴)
  const { appliedFilters, displayedOptionsInTop, toggleAppliedFilter } =
    useExploreFilters();
  const {
    isBottomSheetOpen,
    openBottomSheet,
    closeBottomSheet,
    applyTempFilters,
  } = useExploreUI();
  const { clearTempFilters, toggleTempFilter } = useExploreTempFilters();

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
      <div
        ref={stickyRef}
        className={`sticky top-0 z-10 w-full transition-colors duration-200 ${
          isSticky ? 'bg-primary-800/80 backdrop-blur' : 'bg-transparent'
        }`}
      >
        <div className="w-full">
          {/* 필터 버튼 그룹 */}
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
                      unoptimized
                    />
                  </button>
                </SheetTrigger>

                {/* Sheet 콘텐츠 (해당 콘텐츠는 FilterBottomSheetContent 컴포넌트로 구현) */}
                <SheetContent
                  side="bottom"
                  className="flex flex-col gap-0 h-[60svh] max-h-[60svh] max-w-[640px] w-full mx-auto bg-[#07033E] border-t-0 rounded-t-[20px]"
                >
                  {/* 커스텀 닫기 버튼 */}
                  <button
                    onClick={closeBottomSheet}
                    className="absolute top-4 right-4 w-8 h-8 z-50 flex items-center justify-center rounded-full bg-white/60 hover:bg-white/80 transition"
                    aria-label="닫기"
                  >
                    <X className="w-4 h-4 text-gray-800" />
                  </button>
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
                        unoptimized
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
