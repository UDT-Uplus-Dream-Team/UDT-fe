'use client';

import React, { useState, useEffect } from 'react';
import { Ticket } from '@components/Ticket/Ticket';

// 타입 정의
interface TicketComponent {
  contentId: number;
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  openDate: string;
  runningTime: number;
  episode: string;
  rating: string;
  category: string;
  genres: string[];
  directors: string[];
  casts: string[];
  platforms: string[];
}

type SwipeDirection = 'left' | 'right' | 'up';
type FeedbackType = 'liked' | 'unliked' | 'neutral';

// 모크 데이터 (onboarding에서 가져온 실제 데이터)
const mockMovies: TicketComponent[] = [
  {
    contentId: 1,
    title: '그랜드 부다페스트 호텔',
    description:
      '1927년 세계대전이 한창이던 어느 날, 세계 최고 부호 마담 D가 그랜드 부다페스트 호텔에 다녀간 지 얼마 지나지 않아 의문의 살인을 당한다. 그녀는 유언을 통해 가문 대대로 내려오던 명화 사과를 든 소년을 전설적인 호텔 지배인이자 연인 구스타브 앞으로 남긴다. 마담 D의 유산을 노리고 있던 그의 아들 드미트리는 구스타브를 졸지에 유력한 용의자로 지목하게 되고, 구스타브는 충실한 호텔 로비보이 제로와 함께 누명을 벗기기 위한 기상천외한 모험을 시작한다.',
    posterUrl: '/images/onboarding/onboarding1.jpg',
    backdropUrl: '/images/onboarding/onboarding_back1.jpg',
    openDate: '2014년 3월 20일',
    runningTime: 160,
    episode: '1회차',
    rating: '18세이상관람가',
    category: '영화',
    genres: ['코미디', '드라마'],
    directors: ['웨스 앤더슨'],
    casts: ['랄프 파인스', '머레이 아브라함', '매튜 아모도브'],
    platforms: ['디즈니+', '쿠팡플레이'],
  },
  {
    contentId: 2,
    title: '그린북',
    description:
      '1962년 미국, 입담과 주먹만 믿고 살아가던 토니 발레롱가는 교양과 우아함 그 자체인 천재 피아니스트 돈 셜리의 운전기사 면접을 보게 된다. 백악관에도 초청되는 등 미국 전역에서 콘서트 요청을 받으며 명성을 떨치고 있는 돈 셜리는 위험하기로 소문난 미국 남부 투어 공연을 떠나기로 결심하고, 투어 기간 동안 자신의 보디가드 겸 운전기사로 토니를 고용한다. 거친 인생을 살아온 토니와 교양과 기품을 지키며 살아온 돈. 생각, 행동, 말투, 취향까지 달라도 너무 다른 두 사람은 그들을 위한 여행안내서 그린북에 의존해 특별한 남부 투어를 시작하는데...',
    posterUrl: '/images/onboarding/onboarding2.jpg',
    backdropUrl: '/images/onboarding/onboarding_back2.webp',
    openDate: '2019년 1월 09일',
    runningTime: 130,
    episode: '1회차',
    rating: '12세이상관람가',
    category: '영화',
    genres: ['드라마', '역사'],
    directors: ['피터 패럴리'],
    casts: ['비고 모텐슨', '마허샬라 알리', '린다 카델리니'],
    platforms: ['웨이브', '넷플릭스'],
  },
  {
    contentId: 3,
    title: '보헤미안 랩소디',
    description:
      '공항 수하물 노동자로 일하며 음악의 꿈을 키우던 이민자 출신의 아웃사이더 파록 버사라. 보컬을 구하던 로컬 밴드에 들어가게 되면서 프레디 머큐리라는 이름으로 밴드 퀸을 이끌게 된다. 시대를 앞서가는 독창적인 음악과 화려한 퍼포먼스로 관중들을 사로잡으며 성장하던 퀸은 방송에서 외면을 받을 것이라는 음반사의 반대에도 불구하고 무려 6분 동안 이어지는 실험적인 곡 보헤미안 랩소디로 대성공을 거두며 월드스타 반열에 오른다. 그러나 독보적인 존재감을 뿜어내던 프레디는 솔로 데뷔라는 유혹에 흔들리게 되고, 오랜 시간 함께 해왔던 멤버들과 결별을 선언하게 되는데...',
    posterUrl: '/images/onboarding/onboarding3.webp',
    backdropUrl: '/images/onboarding/onboarding_back3.jpg',
    openDate: '2018년 10월 31일',
    runningTime: 134,
    episode: '1회차',
    rating: '12세이상관람가',
    category: '영화',
    genres: ['드라마', '음악'],
    directors: ['브라이언 싱어'],
    casts: ['라미 말렉', '루시 보인턴', '그윈 리'],
    platforms: ['넷플릭스', '쿠팡플레이'],
  },
];

export default function SwipeTestPage() {
  // 마우스 이벤트 처리 (데스크톱)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection | null>(
    null,
  );
  const [feedback, setFeedback] = useState<FeedbackType>('neutral');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [swipeCount, setSwipeCount] = useState(0);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = useState(false);

  const currentMovie = mockMovies[currentIndex % mockMovies.length];
  const nextMovie = mockMovies[(currentIndex + 1) % mockMovies.length];

  // 스와이프 처리 함수
  const handleSwipe = async (
    direction: SwipeDirection,
    feedbackType?: FeedbackType,
  ) => {
    if (isAnimating || isFlipped) return;

    setIsAnimating(true);
    setSwipeDirection(direction);
    if (feedbackType) setFeedback(feedbackType);
    setIsFlipped(false);
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });

    // 1단계: 스와이프 애니메이션 (700ms)
    setTimeout(() => {
      // 카드 교체만 먼저 실행 (transform은 그대로 유지)
      setCurrentIndex((prev) => prev + 1);
      setSwipeCount((prev) => prev + 1);
    }, 700);

    // 2단계: 상태 리셋 (750ms - 살짝 나중에)
    setTimeout(() => {
      setSwipeDirection(null); // 이제 transform 리셋
      setFeedback('neutral');
      setDragOffset({ x: 0, y: 0 });
      setIsAnimating(false);
    }, 750);
  };

  // 드래그 중 실시간 업데이트
  const updateDragPosition = (clientX: number, clientY: number) => {
    if (!startPoint || isAnimating || isFlipped) return;

    const dx = clientX - startPoint.x;
    const dy = clientY - startPoint.y;

    setDragOffset({ x: dx, y: dy });

    // 드래그 중 피드백 미리보기
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (absX > absY && absX > 50) {
      setFeedback(dx > 0 ? 'liked' : 'unliked');
    } else if (dy < -50) {
      setFeedback('neutral');
    } else {
      setFeedback('neutral');
    }
  };

  // 드래그 종료 시 스와이프 결정
  const finalizeDrag = () => {
    if (!startPoint || isAnimating) return;

    const { x: dx, y: dy } = dragOffset;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const threshold = 150;

    setStartPoint(null);
    setIsDragging(false);

    if (absX > absY && absX > threshold) {
      handleSwipe(dx > 0 ? 'right' : 'left', dx > 0 ? 'liked' : 'unliked');
    } else if (dy < -threshold) {
      handleSwipe('up', 'neutral');
    } else {
      // 스냅백 애니메이션
      setDragOffset({ x: 0, y: 0 });
      setFeedback('neutral');
    }
  };

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isAnimating || isFlipped) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSwipe('left', 'unliked');
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSwipe('right', 'liked');
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleSwipe('up', 'neutral');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAnimating, isFlipped]);

  // 마우스 이벤트 처리 (데스크톱)
  const onPointerDown = (e: React.PointerEvent) => {
    if (isAnimating || isFlipped) return;
    setStartPoint({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
    setDragOffset({ x: 0, y: 0 });
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateDragPosition(e.clientX, e.clientY);
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    finalizeDrag();
  };

  // 터치 이벤트 처리 (모바일)
  const onTouchStart = (e: React.TouchEvent) => {
    if (isAnimating || e.touches.length !== 1 || isFlipped) return;
    e.preventDefault();

    const touch = e.touches[0];
    setStartPoint({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
    setDragOffset({ x: 0, y: 0 });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault();

    const touch = e.touches[0];
    updateDragPosition(touch.clientX, touch.clientY);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging || e.changedTouches.length !== 1) return;
    e.preventDefault();
    finalizeDrag();
  };

  // transform 계산 (드래그 중 실시간 변환)
  const getCardTransform = (): string => {
    if (swipeDirection) {
      // 스와이프 완료 애니메이션
      switch (swipeDirection) {
        case 'left':
          return 'translate3d(-100vw, 0, 0) rotate(-30deg)';
        case 'right':
          return 'translate3d(100vw, 0, 0) rotate(30deg)';
        case 'up':
          return 'translate3d(0, -100vh, 0)';
      }
    }

    if (isDragging) {
      // 드래그 중 실시간 변환
      const { x, y } = dragOffset;
      const rotation = Math.max(-30, Math.min(30, x * 0.1)); // 회전 제한
      const scale = Math.max(0.95, 1 - Math.abs(x) * 0.0001); // 살짝 축소 효과

      return `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg) scale(${scale})`;
    }

    return 'translate3d(0, 0, 0)';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      {/* 헤더 */}
      <div className="text-center text-white mb-8">
        <h1 className="text-2xl font-bold mb-2">스와이프 테스트</h1>
        <p className="text-sm opacity-80">
          👆위: 관심없음 | 👈좌: 싫어요 | 👉우: 좋아요 | 스와이프 횟수:{' '}
          {swipeCount}
        </p>
        <p className="text-xs opacity-60 mt-1">
          키보드 방향키로도 테스트 가능합니다
        </p>
      </div>

      {/* 카드 영역 */}
      <div className="flex flex-col w-full max-w-sm items-center justify-center">
        <div className="my-5 flex w-full justify-center">
          <div
            className={`relative inline-block mx-10 w-full select-none ${
              isFlipped ? 'touch-action-auto' : 'touch-action-none'
            }`}
            style={{
              touchAction: isFlipped ? 'auto' : 'none',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              setStartPoint(null);
              setIsDragging(false);
              setDragOffset({ x: 0, y: 0 });
              setFeedback('neutral');
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={() => {
              setStartPoint(null);
              setIsDragging(false);
              setDragOffset({ x: 0, y: 0 });
              setFeedback('neutral');
            }}
          >
            {/* 자리 채우기 카드 (invisible) */}
            <div className="relative flex w-full h-[70svh] aspect-[75/135] min-w-70 min-h-110 max-w-100 max-h-180 invisible pointer-events-none items-center justify-center">
              <Ticket
                movie={currentMovie}
                variant="initial"
                feedback="neutral"
              />
            </div>

            {/* 다음 카드 peek */}
            <div
              className={`absolute inset-0 z-10 flex items-center justify-center pointer-events-none transition-all duration-300 ease-out ${
                isAnimating && swipeDirection
                  ? 'opacity-100 scale-100 translate-y-0 blur-none' // 스와이프 중: 앞으로 튀어나옴
                  : isDragging
                    ? 'opacity-60 scale-95 translate-y-1 blur-sm' // 드래그 중: 살짝 앞으로
                    : 'opacity-50 scale-90 translate-y-2 blur-sm' // 대기 중: 뒤에서 대기
              }`}
            >
              <Ticket movie={nextMovie} variant="initial" feedback="neutral" />
            </div>

            {/* 현재 카드 */}
            <div
              className={`absolute inset-0 z-20 flex items-center justify-center ${
                swipeDirection
                  ? 'transition-transform duration-700 ease-linear' // 스와이프 중
                  : isDragging
                    ? '' // 드래그 중에는 transition 없음
                    : isAnimating
                      ? ''
                      : 'transition-all duration-300 ease-out' // 일반 상태 (스냅백 등)
              }`}
              style={{
                perspective: '1000px',
                transform: getCardTransform(),
              }}
            >
              <div
                className={`relative w-full h-full ${
                  isAnimating && !isDragging ? 'opacity-0' : 'opacity-100'
                } transition-opacity duration-300`}
              >
                <div
                  className="relative w-full h-full"
                  style={{
                    transformStyle: 'preserve-3d',
                    transition: 'transform 500ms linear',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* Front */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                      isFlipped ? 'opacity-0' : 'opacity-100'
                    }`}
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <Ticket
                      movie={currentMovie}
                      feedback={feedback}
                      variant="initial"
                    />
                  </div>

                  {/* Back (detail view) */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                      isFlipped ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      pointerEvents: isFlipped ? 'auto' : 'none',
                      zIndex: isFlipped ? 30 : 10,
                    }}
                  >
                    <Ticket movie={currentMovie} variant="detail" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 플립 버튼 */}
        <div className="relative z-30 flex flex-col items-center gap-4">
          <button
            onClick={() => setIsFlipped((f) => !f)}
            className="bg-white/20 border border-white/20 text-white px-5 py-2 text-sm rounded hover:bg-white/20 backdrop-blur-sm transition-colors"
          >
            {isFlipped ? '돌아가기' : '상세보기'}
          </button>
        </div>

        {/* 수동 테스트 버튼들 */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => handleSwipe('left', 'unliked')}
            className="bg-red-500 text-white px-3 py-2 rounded text-xs hover:bg-red-600 transition-colors"
            disabled={isAnimating}
          >
            싫어요 ←
          </button>
          <button
            onClick={() => handleSwipe('up', 'neutral')}
            className="bg-gray-500 text-white px-3 py-2 rounded text-xs hover:bg-gray-600 transition-colors"
            disabled={isAnimating}
          >
            관심없음 ↑
          </button>
          <button
            onClick={() => handleSwipe('right', 'liked')}
            className="bg-green-500 text-white px-3 py-2 rounded text-xs hover:bg-green-600 transition-colors"
            disabled={isAnimating}
          >
            → 좋아요
          </button>
        </div>
      </div>
    </div>
  );
}
