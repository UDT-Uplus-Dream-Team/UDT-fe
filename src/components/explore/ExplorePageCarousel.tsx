'use client';

import React, {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
  useCallback,
} from 'react';
import { motion, useMotionValue, animate, PanInfo } from 'framer-motion';
import { RepresentativeContentCard } from '@components/explore/RepresentativeContentCard';
import { useGetLatestContents } from '@hooks/explore/useGetLatestContents';
import { FilterRadioButton } from '@components/explore/FilterRadioButton';
import { ExplorePageCarouselSkeleton } from '@components/explore/ExplorePageCarouselSkeleton';
import { RecentContentData } from '@type/explore/Explore';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@components/ui/sheet';
import { DetailBottomSheetContent } from '@components/explore/DetailBottomSheetContent';
import { useQueryErrorToast } from '@hooks/useQueryErrorToast';
import { X } from 'lucide-react';

const CARD_WIDTH = 272;
const CARD_GAP = 8;
const SWIPE_THRESHOLD = 60;
const SCALE_FACTOR = 0.85;
const SCALE_RANGE = 2;
const REPEAT_COUNT = 21;
const JUMP_FADE_DURATION = 200;

// 탐색 페이지 상단의 무한?캐러셀 컴포넌트
export const ExplorePageCarousel = ({ autoPlayInterval = 3000 }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  // 중심 index는 반드시 width, data 둘 다 준비된 후에만 세팅!
  const [containerWidth, setContainerWidth] = useState(0);
  const [isDomReady, setIsDomReady] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1); // 처음엔 -1로 시작
  const [selectedContent, setSelectedContent] =
    useState<RecentContentData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [jumping, setJumping] = useState(false);
  const [carouselOpacity, setCarouselOpacity] = useState(1);
  const x = useMotionValue(0);

  // 데이터 가져오기
  const getLatestContentsQuery = useGetLatestContents();
  const { data: contents, status, refetch } = getLatestContentsQuery;
  useQueryErrorToast(getLatestContentsQuery);
  const contentsLength = contents?.length ?? 0;
  const extendedMovies = useMemo(
    () => (contentsLength ? Array(REPEAT_COUNT).fill(contents).flat() : []),
    [contents],
  );
  const startIndex = useMemo(
    () => (contentsLength ? contentsLength * Math.floor(REPEAT_COUNT / 2) : 0),
    [contents],
  );
  const CARD_TOTAL_WIDTH = CARD_WIDTH + CARD_GAP;
  const getTargetX = (index: number) =>
    containerWidth / 2 - CARD_WIDTH / 2 - index * CARD_TOTAL_WIDTH;

  // 1. 최초 마운트시 ref DOM이 완전히 준비된 뒤에만 width 계산
  useLayoutEffect(() => {
    let retryCount = 0;
    function checkDomReady() {
      if (carouselRef.current) {
        setIsDomReady(true);
        setContainerWidth(carouselRef.current.offsetWidth);
      } else if (retryCount < 10) {
        retryCount += 1;
        setTimeout(checkDomReady, 30); // ref 안 잡혔으면 조금 뒤에 재시도 (최대 10번)
      }
    }
    checkDomReady();
  }, []);

  // 2. ResizeObserver: ref, width 준비되고 나서만 사용!
  useEffect(() => {
    if (!isDomReady || !carouselRef.current) return;
    const handleResize = () =>
      setContainerWidth(carouselRef.current!.offsetWidth);
    const observer = new ResizeObserver(handleResize);
    observer.observe(carouselRef.current);
    handleResize();
    return () => observer.disconnect();
  }, [isDomReady]);

  // 3. 데이터/width 둘 다 준비된 뒤에 중심 currentIndex 강제 세팅 (1회만)
  useEffect(() => {
    if (
      isDomReady &&
      contentsLength > 0 &&
      containerWidth > 0 &&
      currentIndex !== startIndex
    ) {
      setCurrentIndex(startIndex);
      x.set(getTargetX(startIndex)); // x 좌표도 강제 세팅
    }
  }, [isDomReady, contentsLength, containerWidth, startIndex]);

  // 4. currentIndex 변화시 x/spring/jump
  useEffect(() => {
    if (
      !isDomReady ||
      contentsLength === 0 ||
      containerWidth === 0 ||
      currentIndex === -1
    )
      return;
    const EXTENDED_MIN = contentsLength * 5;
    const EXTENDED_MAX = contentsLength * (REPEAT_COUNT - 5);

    if (currentIndex <= EXTENDED_MIN || currentIndex >= EXTENDED_MAX) {
      // Jump (딱 1번만!)
      setJumping(true);
      setCarouselOpacity(0);
      setTimeout(() => {
        setCurrentIndex(startIndex);
        x.set(getTargetX(startIndex));
        setTimeout(() => {
          setCarouselOpacity(1);
          setJumping(false);
        }, JUMP_FADE_DURATION);
      }, JUMP_FADE_DURATION);
    } else {
      animate(x, getTargetX(currentIndex), {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      });
    }
  }, [currentIndex, isDomReady, contentsLength, containerWidth, startIndex]);

  // 5. 드래그/스와이프
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      let next = currentIndex;
      if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -500) next += 1;
      else if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > 500)
        next -= 1;
      setIsDragging(false);
      setCurrentIndex(next);
    },
    [currentIndex],
  );

  // 6. 자동 재생 (모든 조건 완전히 만족시에만)
  useEffect(() => {
    if (
      !isDomReady ||
      isDragging ||
      jumping ||
      currentIndex === -1 ||
      contentsLength === 0 ||
      containerWidth === 0
    )
      return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [
    isDomReady,
    isDragging,
    jumping,
    currentIndex,
    contentsLength,
    containerWidth,
    autoPlayInterval,
  ]);

  // 카드 스케일
  const getCardScale = (index: number) => {
    if (!contentsLength) return SCALE_FACTOR;
    const logicalIndex = index % contentsLength;
    const logicalCurrent = currentIndex % contentsLength;
    const direct = Math.abs(logicalIndex - logicalCurrent);
    const wrapped = contentsLength - direct;
    const distance = Math.min(direct, wrapped);
    if (distance > SCALE_RANGE) return SCALE_FACTOR;
    return 1 - (distance / SCALE_RANGE) * (1 - SCALE_FACTOR);
  };

  // 상태별 UI
  if (status === 'pending') return <ExplorePageCarouselSkeleton />;
  if (status === 'error')
    return (
      <div className="w-full h-40 flex flex-col items-center justify-center gap-4 px-6">
        <span className="text-white text-lg text-center">
          오류가 발생했습니다.
        </span>
        <FilterRadioButton onToggle={() => refetch()} label="다시 시도하기" />
      </div>
    );
  if (!contentsLength)
    return (
      <div className="w-full max-w-5xl mx-auto py-12 flex justify-center text-gray-500">
        표시할 영화가 없습니다.
      </div>
    );

  // UI 렌더
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div
        ref={carouselRef}
        className="overflow-hidden touch-pan-x w-full select-none"
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: -99999, right: 99999 }}
          style={{
            x,
            display: 'flex',
            cursor: 'grab',
            userSelect: 'none',
            pointerEvents: jumping ? 'none' : 'auto',
            opacity: carouselOpacity,
            transition: `opacity ${JUMP_FADE_DURATION}ms cubic-bezier(.4,0,.2,1)`,
          }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
        >
          {extendedMovies.map((content, index) => {
            const scale = getCardScale(index);
            const logicalIndex = index % contentsLength;
            const logicalCurrent = currentIndex % contentsLength;
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
                onClick={() =>
                  !isDragging &&
                  !jumping &&
                  isCurrent &&
                  setSelectedContent(content)
                }
                tabIndex={isCurrent ? 0 : -1}
                role="button"
                aria-label={isCurrent ? '자세히 보기' : undefined}
              >
                <div className="relative">
                  <RepresentativeContentCard content={content} />
                  {!isCurrent && (
                    <div className="absolute inset-0 bg-black/40 rounded-lg pointer-events-none" />
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
      {/* 상세 정보 BottomSheet */}
      <Sheet
        open={!!selectedContent}
        onOpenChange={(open) => !open && setSelectedContent(null)}
      >
        <SheetContent
          side="bottom"
          hideDefaultClose={true}
          className="px-0 pb-5 h-[90svh] max-w-[640px] w-full mx-auto rounded-t-2xl bg-primary-800 flex flex-col overflow-y-auto scrollbar-hide gap-0"
        >
          <button
            onClick={() => setSelectedContent(null)}
            className="absolute top-4 right-4 w-8 h-8 z-50 flex items-center justify-center rounded-full bg-white/60 hover:bg-white/80 transition"
            aria-label="닫기"
          >
            <X className="w-4 h-4 text-gray-800" />
          </button>
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
