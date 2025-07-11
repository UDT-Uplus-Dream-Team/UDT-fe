'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { RepresentativeContentCard } from '@components/explore/RepresentativeContentCard';
import { MovieData } from '@type/Moviedata';

interface CarouselProps {
  movies: MovieData[];
  autoPlayInterval?: number; // 자동 재생 간격 (ms)
  onCardClick?: (movie: MovieData) => void;
}

// 상수 정의 - RepresentativeContentCard 크기에 맞게 조정
const CARD_WIDTH = 272; // w-68 (272px)에 맞춤
const CARD_GAP = 8;
const SWIPE_THRESHOLD = 80;
const REPEAT_COUNT = 7; // 배열 복제 횟수 증가 (더 긴 무한 스크롤)
const SCALE_FACTOR = 0.85; // 양옆 카드의 최소 크기 (85%)
const SCALE_RANGE = 2; // 스케일이 적용되는 범위 (현재 카드 기준 ±2)

// 양옆에 이전/다음 카드가 살짝 보이는 ExplorePageCarousel 컴포넌트
export const ExplorePageCarousel = ({
  movies,
  autoPlayInterval = 3000, // 기본 3초
  onCardClick,
}: CarouselProps) => {
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 메모이제이션된 확장 배열
  const extendedMovies = useMemo(() => {
    return Array(REPEAT_COUNT).fill(movies).flat();
  }, [movies]);

  // 계산된 값들 - 더 긴 범위로 설정
  const startIndex = movies.length * 3; // 중앙 배열의 시작 (더 중앙으로)
  const resetIndex = movies.length * 6; // 리셋 인덱스 (더 늦게)
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  // 자동 재생 시작 함수
  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }

    if (isAutoPlaying && movies.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const nextIndex = prev + 1;
          if (nextIndex >= resetIndex) {
            return nextIndex; // handleTransitionEnd에서 리셋 처리
          }
          return nextIndex;
        });
      }, autoPlayInterval);
    }
  }, [isAutoPlaying, movies.length, autoPlayInterval, resetIndex]);

  // 자동 재생 중지 함수
  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  // 리셋 함수 개선 - 즉시 이동으로 변경
  const resetToCenter = useCallback(() => {
    // 기존 타이머 정리
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }

    // 자동 재생 중지
    stopAutoPlay();

    // 애니메이션 완전히 끄고 즉시 이동
    setIsTransitioning(true);
    setCurrentIndex(startIndex);

    // 즉시 애니메이션 복원 (다음 프레임에서)
    resetTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
      startAutoPlay(); // 명시적으로 자동 재생 재시작
    }, 0); // 즉시 복원
  }, [startIndex, stopAutoPlay, startAutoPlay]);

  // 애니메이션 완료 후 리셋 처리
  const handleTransitionEnd = useCallback(() => {
    if (currentIndex >= resetIndex || currentIndex < movies.length) {
      resetToCenter();
    }
  }, [currentIndex, movies.length, resetIndex, resetToCenter]);

  // 카드 크기 계산 함수
  const getCardScale = useCallback(
    (index: number) => {
      const distance = Math.abs(index - currentIndex);

      if (distance === 0) {
        return 1; // 현재 카드는 원래 크기
      }

      if (distance > SCALE_RANGE) {
        return SCALE_FACTOR; // 범위 밖은 최소 크기
      }

      // 거리에 따른 선형 보간
      const scale = 1 - (distance / SCALE_RANGE) * (1 - SCALE_FACTOR);
      return Math.max(scale, SCALE_FACTOR);
    },
    [currentIndex],
  );

  // 컨테이너 크기 측정
  useEffect(() => {
    const updateContainerWidth = () => {
      if (carouselRef.current) {
        setContainerWidth(carouselRef.current.offsetWidth);
      }
    };

    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);

    return () => {
      window.removeEventListener('resize', updateContainerWidth);
    };
  }, []);

  // 자동 재생 기능
  useEffect(() => {
    startAutoPlay();

    return () => {
      stopAutoPlay();
    };
  }, [startAutoPlay, stopAutoPlay]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  // 마우스/터치 이벤트 핸들러
  const handleMouseDown = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    ) => {
      if (isTransitioning) return; // 전환 중에는 드래그 방지

      // 드래그 시작 시 자동 재생 중지
      stopAutoPlay();

      setIsDragging(true);
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      setStartX(clientX);
      setTranslateX(0);
    },
    [isTransitioning, stopAutoPlay],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging || isTransitioning) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const diff = clientX - startX;
      setTranslateX(diff);
    },
    [isDragging, startX, isTransitioning],
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging || isTransitioning) return;

    setIsDragging(false);

    if (Math.abs(translateX) > SWIPE_THRESHOLD) {
      const direction = translateX > 0 ? -1 : 1;
      setCurrentIndex((prev) => {
        const newIndex = prev + direction;
        if (newIndex >= resetIndex || newIndex < movies.length) {
          return newIndex; // handleTransitionEnd에서 리셋 처리
        }
        return newIndex;
      });
    }

    setTranslateX(0);

    // 드래그 종료 시 자동 재생 재시작
    if (isAutoPlaying) {
      startAutoPlay();
    }
  }, [
    isDragging,
    translateX,
    movies.length,
    resetIndex,
    isTransitioning,
    isAutoPlaying,
    startAutoPlay,
  ]);

  // 이벤트 리스너 등록
  useEffect(() => {
    const element = carouselRef.current;
    if (!element) return;

    const handleMouseMoveEvent = (e: MouseEvent | TouchEvent) =>
      handleMouseMove(e);
    const handleMouseUpEvent = () => handleMouseUp();

    element.addEventListener('mousemove', handleMouseMoveEvent);
    element.addEventListener('touchmove', handleMouseMoveEvent);
    element.addEventListener('mouseup', handleMouseUpEvent);
    element.addEventListener('touchend', handleMouseUpEvent);
    element.addEventListener('mouseleave', handleMouseUpEvent);

    return () => {
      element.removeEventListener('mousemove', handleMouseMoveEvent);
      element.removeEventListener('touchmove', handleMouseMoveEvent);
      element.removeEventListener('mouseup', handleMouseUpEvent);
      element.removeEventListener('touchend', handleMouseUpEvent);
      element.removeEventListener('mouseleave', handleMouseUpEvent);
    };
  }, [handleMouseMove, handleMouseUp]);

  // 마우스 호버 핸들러
  const handleMouseEnter = useCallback(() => {
    setIsAutoPlaying(false);
    stopAutoPlay();
  }, [stopAutoPlay]);

  const handleMouseLeave = useCallback(() => {
    setIsAutoPlaying(true);
    startAutoPlay();
  }, [startAutoPlay]);

  // transform 계산 (메모이제이션) - 새로운 카드 크기에 맞게 조정
  const transformStyle = useMemo(
    () => ({
      transform: `translateX(${
        containerWidth / 2 -
        CARD_WIDTH / 2 +
        -currentIndex * (CARD_WIDTH + CARD_GAP) +
        translateX
      }px)`,
    }),
    [containerWidth, currentIndex, translateX],
  );

  return (
    <div
      className="w-full max-w-5xl mx-auto"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Carousel 컨테이너 */}
      <div
        ref={carouselRef}
        className="overflow-hidden rounded-lg"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div
          className={`flex ${
            isTransitioning ? '' : 'transition-transform duration-300 ease-out'
          }`}
          style={transformStyle}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedMovies.map((movie, index) => {
            const scale = getCardScale(index);
            const isCurrentCard = index === currentIndex;

            return (
              <div
                key={`${movie.contentId}-${index}`}
                className="flex-shrink-0"
                style={{
                  marginRight: `${CARD_GAP}px`,
                  transform: `scale(${scale})`,
                  transformOrigin: 'center bottom', // 하단 기준으로 스케일
                  transition: 'transform 0.3s ease-out',
                }}
              >
                <div className="relative">
                  <RepresentativeContentCard
                    movie={movie}
                    onClick={() => onCardClick?.(movie)}
                  />

                  {/* 현재 카드가 아닌 경우 어둡게 처리 */}
                  {!isCurrentCard && (
                    <div className="absolute inset-0 bg-black/40 rounded-lg pointer-events-none" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
