'use client';

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { RepresentativeContentCard } from '@components/explore/RepresentativeContentCard';
// TODO: 나중에 MVP를 거치며 최신 콘텐츠 목록 조회가 아닌 다른 것을 조회하는 것으로 바뀔 수 있음 -> 명칭 변경될 수도 있음
import { useGetLatestContents } from '@hooks/explore/useGetLatestContents';
import { FilterRadioButton } from '@components/explore/FilterRadioButton';
import { ExplorePageCarouselSkeleton } from '@components/explore/ExplorePageCarouselSkeleton';
import { RecentContentData } from '@/types/explore/Explore';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@components/ui/sheet';
import { DetailBottomSheetContent } from './DetailBottomSheetContent';

interface CarouselProps {
  autoPlayInterval?: number;
}

const CARD_WIDTH = 272;
const CARD_GAP = 8;
const SWIPE_THRESHOLD = 60;
const SCALE_FACTOR = 0.85;
const SCALE_RANGE = 2;
const REPEAT_COUNT = 5; // 배열 반복 횟수

// 탐색 페이지의 맨 위에 표시되는 카드 Carousel 컴포넌트
export const ExplorePageCarousel = ({
  autoPlayInterval = 3000,
}: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [containerWidth, setContainerWidth] = useState(0);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  // 부모에서만 상세 시트 상태/분기 처리 진행해야 함
  const [selectedContent, setSelectedContent] =
    useState<RecentContentData | null>(null);

  const draggedContentRef = useRef<RecentContentData | null>(null);

  const { data: contents, status, refetch } = useGetLatestContents();

  const extendedMovies = useMemo(() => {
    if (!contents || contents.length === 0) return [];
    return Array(REPEAT_COUNT).fill(contents).flat();
  }, [contents]);

  // 시작 인덱스
  const startIndex = useMemo(() => {
    if (!contents || contents.length === 0) return 0;
    return contents.length * Math.floor(REPEAT_COUNT / 2);
  }, [contents]);

  // 리셋 인덱스
  const resetIndex = useMemo(() => {
    if (!contents || contents.length === 0) return 0;
    return contents.length * (REPEAT_COUNT - 1);
  }, [contents]);

  // 시작 인덱스 설정 (movies length가 0이 아닐 때만 설정)
  const contentsLength = useMemo(() => contents?.length ?? 0, [contents]);

  useEffect(() => {
    if (contentsLength > 0) setCurrentIndex(startIndex);
  }, [startIndex, contentsLength]);

  // 1. 초기 mount 시 + 리사이즈 시
  useEffect(() => {
    const update = () => {
      requestAnimationFrame(() => {
        if (carouselRef.current) {
          setContainerWidth(carouselRef.current.offsetWidth);
        }
      });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // 2. movies 로드 후 정확한 offsetWidth 측정
  useEffect(() => {
    if (contentsLength === 0) return;
    requestAnimationFrame(() => {
      if (carouselRef.current) {
        setContainerWidth(carouselRef.current.offsetWidth);
      }
    });
  }, [contentsLength]);

  // 3. containerWidth가 잡힌 후에만 중심 index 설정
  useEffect(() => {
    if (contentsLength > 0 && containerWidth > 0) {
      setCurrentIndex(startIndex);
    }
  }, [contentsLength, containerWidth, startIndex]);

  // 자동 재생 시작 메소드
  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current); // 이미 재생 중이면 중지
    if (contentsLength > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => prev + 1);
      }, autoPlayInterval);
    }
  }, [contentsLength, autoPlayInterval]);

  // 자동 재생 중지 메소드
  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      // 재생 중이면 중지
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  // 자동 재생 시작 및 중지 메소드 호출
  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay, stopAutoPlay]);

  // 트랜지션 끝나면 중앙으로 리셋
  const handleTransitionEnd = () => {
    if (currentIndex >= resetIndex || currentIndex < contentsLength) {
      setIsTransitioning(false);
      setCurrentIndex(startIndex);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsTransitioning(true));
      });
    }
  };

  // 마우스 또는 터치 시작 시 드래그 시작
  const handleMouseDown = (
    e: React.MouseEvent | React.TouchEvent,
    content?: RecentContentData,
  ) => {
    stopAutoPlay();
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setTranslateX(0);
    setIsTransitioning(false);

    // 누른 시점에 해당 카드의 콘텐츠 정보 기록
    if (content) draggedContentRef.current = content;
  };

  // 마우스 또는 터치 시작 시 드래그 중 마우스 이동 핸들러
  const handleMouseMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      setTranslateX(clientX - startX);
    },
    [isDragging, startX],
  );

  // 마우스 또는 터치 시작 시 드래그 중 마우스 이동 핸들러
  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;

    if (Math.abs(translateX) > SWIPE_THRESHOLD) {
      // 드래그: 인덱스 이동
      const direction = translateX > 0 ? -1 : 1;
      setCurrentIndex((prev) => prev + direction);
    } else if (draggedContentRef.current) {
      // 드래그 아닌 클릭(=짧게 눌렀다 뗀 경우): 상세 오픈
      setSelectedContent(draggedContentRef.current);
    }
    setTranslateX(0);
    setIsDragging(false);
    setIsTransitioning(true);
    startAutoPlay();
  }, [translateX, isDragging, startAutoPlay]);

  // 마우스 또는 터치 시작 시 드래그 중 마우스 핸들러 추가
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const transformStyle = useMemo(() => {
    const baseX =
      containerWidth / 2 -
      CARD_WIDTH / 2 -
      currentIndex * (CARD_WIDTH + CARD_GAP);
    return {
      transform: `translateX(${baseX + translateX}px)`,
    };
  }, [containerWidth, currentIndex, translateX]);

  // 스케일 계산 최적화: 현재 중심 index를 movies.length 기준으로 정규화
  const getCardScale = (index: number) => {
    const logicalIndex = index % contentsLength;
    const logicalCurrent = currentIndex % contentsLength;

    // 원형 거리 계산
    const direct = Math.abs(logicalIndex - logicalCurrent);
    const wrapped = contentsLength - direct;
    const distance = Math.min(direct, wrapped);

    if (distance > SCALE_RANGE) return SCALE_FACTOR;
    return 1 - (distance / SCALE_RANGE) * (1 - SCALE_FACTOR);
  };

  // 로딩 상태 처리
  if (status === 'pending') {
    return <ExplorePageCarouselSkeleton />;
  }

  // 에러 상태 처리
  if (status === 'error') {
    return (
      <div className="w-full h-40 flex flex-col items-center justify-center gap-4 px-6">
        <span className="text-white text-lg text-center">
          오류가 발생했습니다.
        </span>
        <FilterRadioButton onToggle={() => refetch()} label="다시 시도하기" />
      </div>
    );
  }

  // status가 success이지만, 콘텐츠가 없는 경우 처리
  if (contents.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto py-12 flex justify-center text-gray-500">
        표시할 영화가 없습니다.
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-5xl mx-auto"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
    >
      <div
        ref={carouselRef}
        className="overflow-hidden"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div
          className={`flex ${
            isTransitioning ? 'transition-transform duration-300 ease-out' : ''
          }`}
          style={transformStyle}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedMovies.map((content, index) => {
            const scale = getCardScale(index);
            const logicalIndex = index % contents.length;
            const logicalCurrent = currentIndex % contents.length;
            const isCurrent = logicalIndex === logicalCurrent;

            return (
              <div
                key={`${content.contentId}-${index}`}
                className="flex-shrink-0"
                style={{
                  width: CARD_WIDTH,
                  marginRight: CARD_GAP,
                  transform: `scale(${scale})`,
                  transformOrigin: 'center bottom',
                  transition: 'transform 0.3s ease-out',
                }}
              >
                <div className="relative">
                  <RepresentativeContentCard
                    content={content}
                    onMouseDown={(e) => handleMouseDown(e, content)}
                    onTouchStart={(e) => handleMouseDown(e, content)}
                  />
                  {!isCurrent && (
                    <div className="absolute inset-0 bg-black/40 rounded-lg pointer-events-none" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* 영화 상세 정보 BottomSheet (필요 시 pop-up) */}
      <Sheet
        open={!!selectedContent}
        onOpenChange={(open) => {
          if (!open) setSelectedContent(null);
        }}
      >
        <SheetContent
          side="bottom"
          className="px-0 pb-5 h-[90vh] max-w-[640px] w-full mx-auto rounded-t-2xl bg-primary-800 flex flex-col overflow-y-auto scrollbar-hide gap-0"
        >
          {/* 표시되지 않는 Header (Screen Reader에서만 읽힘) */}
          <SheetHeader className="p-0">
            <SheetTitle className="sr-only h-0 p-0">상세정보</SheetTitle>
          </SheetHeader>
          {selectedContent && (
            <DetailBottomSheetContent contentId={selectedContent.contentId} />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};
