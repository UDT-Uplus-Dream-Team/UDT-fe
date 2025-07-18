'use client';

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { RepresentativeContentCard } from '@/components/explore/RepresentativeContentCard';
import { Loader2, RefreshCw } from 'lucide-react';
import type { RecentContentData } from '@type/explore/Explore';
// TODO: 나중에 MVP를 거치며 최신 콘텐츠 목록 조회가 아닌 다른 것을 조회하는 것으로 바뀔 수 있음 -> 명칭 변경될 수도 있음
// import { useGetLatestContents } from '@hooks/explore/useGetLatestContents'; // 현재는 최신 콘텐츠를 불러오는 것으로 구현되어 있음

interface CarouselProps {
  autoPlayInterval?: number;
}

const CARD_WIDTH = 272;
const CARD_GAP = 8;
const SWIPE_THRESHOLD = 60;
const SCALE_FACTOR = 0.85;
const SCALE_RANGE = 2;
const REPEAT_COUNT = 5; // 배열 반복 횟수

// Mock 데이터
const MOCK_LATEST_CONTENTS: RecentContentData[] = [
  {
    contentId: 1,
    title: '센과 치히로의 행방불명',
    posterUrl: '/images/poster1.webp',
    categories: ['애니메이션', '판타지'],
    genres: ['모험', '가족', '스튜디오지브리'],
  },
  {
    contentId: 2,
    title: '이웃집 토토로',
    posterUrl: '/images/poster2.webp',
    categories: ['애니메이션', '가족'],
    genres: ['힐링', '판타지', '스튜디오지브리'],
  },
  {
    contentId: 3,
    title: '벼랑 위의 포뇨',
    posterUrl: '/images/poster3.webp',
    categories: ['애니메이션', '가족'],
    genres: ['모험', '힐링', '스튜디오지브리'],
  },
  {
    contentId: 4,
    title: '하울의 움직이는 성',
    posterUrl: '/images/poster1.webp',
    categories: ['애니메이션', '로맨스'],
    genres: ['판타지', '전쟁', '스튜디오지브리'],
  },
  {
    contentId: 5,
    title: '마녀 배달부 키키',
    posterUrl: '/images/poster2.webp',
    categories: ['애니메이션', '성장'],
    genres: ['힐링', '모험', '스튜디오지브리'],
  },
  {
    contentId: 6,
    title: '모노노케 히메',
    posterUrl: '/images/poster3.webp',
    categories: ['애니메이션', '판타지'],
    genres: ['모험', '환경', '스튜디오지브리'],
  },
];

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

  // const {
  //   data: contents,
  //   isLoading,
  //   isError,
  //   refetch,
  // } = useGetLatestContents();

  const contents = MOCK_LATEST_CONTENTS;
  const isLoading = false;
  const isError = false;

  const extendedMovies = useMemo(() => {
    return Array(REPEAT_COUNT).fill(contents).flat();
  }, [contents]);

  // 시작 인덱스
  const startIndex = useMemo(
    () => contents.length * Math.floor(REPEAT_COUNT / 2),
    [contents],
  );

  // 리셋 인덱스
  const resetIndex = useMemo(
    () => contents.length * (REPEAT_COUNT - 1),
    [contents],
  );

  // 시작 인덱스 설정 (movies length가 0이 아닐 때만 설정)
  useEffect(() => {
    if (contents.length > 0) setCurrentIndex(startIndex);
  }, [startIndex, contents.length]);

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
    if (contents.length === 0) return;
    requestAnimationFrame(() => {
      if (carouselRef.current) {
        setContainerWidth(carouselRef.current.offsetWidth);
      }
    });
  }, [contents]);

  // 3. containerWidth가 잡힌 후에만 중심 index 설정
  useEffect(() => {
    if (contents.length > 0 && containerWidth > 0) {
      setCurrentIndex(startIndex);
    }
  }, [contents.length, containerWidth, startIndex]);

  // 자동 재생 시작 메소드
  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current); // 이미 재생 중이면 중지
    if (contents.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => prev + 1);
      }, autoPlayInterval);
    }
  }, [contents.length, autoPlayInterval]);

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
    if (currentIndex >= resetIndex || currentIndex < contents.length) {
      setIsTransitioning(false);
      setCurrentIndex(startIndex);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsTransitioning(true));
      });
    }
  };

  // 마우스 또는 터치 시작 시 드래그 시작
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    stopAutoPlay();
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setTranslateX(0);
    setIsTransitioning(false);
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
      const direction = translateX > 0 ? -1 : 1;
      setCurrentIndex((prev) => prev + direction);
    }
    setTranslateX(0);
    setIsDragging(false);
    setIsTransitioning(true);
    startAutoPlay();
  }, [translateX, isDragging]);

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
    const logicalIndex = index % contents.length;
    const logicalCurrent = currentIndex % contents.length;

    // 원형 거리 계산
    const direct = Math.abs(logicalIndex - logicalCurrent);
    const wrapped = contents.length - direct;
    const distance = Math.min(direct, wrapped);

    if (distance > SCALE_RANGE) return SCALE_FACTOR;
    return 1 - (distance / SCALE_RANGE) * (1 - SCALE_FACTOR);
  };

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto py-12 flex flex-col items-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-gray-600">영화 데이터를 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태 처리
  if (isError) {
    return (
      <div className="w-full max-w-5xl mx-auto py-12 flex flex-col items-center space-y-4">
        <p className="text-red-500">{isError}</p>
        <button
          // onClick={() => refetch()}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          다시 시도
        </button>
      </div>
    );
  }

  // 콘텐츠가 없는 경우 처리
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
                  <RepresentativeContentCard content={content} />
                  {!isCurrent && (
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
