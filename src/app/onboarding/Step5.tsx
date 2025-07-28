'use client';

import { useState, useEffect, useRef } from 'react';
import { Ticket } from '@components/Ticket/Ticket';
import { MockMovies } from './moviedata';

interface StepProps5 {
  onNext: () => void;
}

type SwipeDirection = 'left' | 'right' | 'up';
type FeedbackType = 'liked' | 'unliked' | 'neutral';

export default function Step5({ onNext }: StepProps5) {
  // ── 상태 ─────────────────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextMovie, setNextMovie] = useState(
    MockMovies.length > 1 ? MockMovies[1] : null,
  );
  const [isFlipped, setIsFlipped] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection | null>(
    null,
  );
  const [feedback, setFeedback] = useState<FeedbackType>('neutral');
  const [isAnimating, setIsAnimating] = useState(false);
  const startPoint = useRef<{ x: number; y: number } | null>(null);

  const currentMovie = MockMovies[currentIndex];

  // ── 스와이프 처리 ──────────────────────────────────────────────────
  const handleSwipe = (
    direction: SwipeDirection,
    feedbackType?: FeedbackType,
  ) => {
    if (isAnimating || isFlipped) return;
    setIsAnimating(true);
    setSwipeDirection(direction);
    if (feedbackType) setFeedback(feedbackType);
    setIsFlipped(false);

    // 애니메이션 → 인덱스 이동
    setTimeout(() => {
      setSwipeDirection(null);
      setCurrentIndex((prev) => prev + 1);
      setFeedback('neutral');
    }, 700);

    // 애니메이션 잠금 해제
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };
  // ── 다음페이지로
  useEffect(() => {
    if (currentIndex >= 2) {
      onNext();
    }
  }, [currentIndex, onNext]);

  useEffect(() => {
    if (!isAnimating) {
      const nextIdx = currentIndex + 1;
      setNextMovie(MockMovies[nextIdx] ?? null);
    }
  }, [isAnimating, currentIndex]);

  // ── 키보드 스와이프 지원 ────────────────────────────────────────────
  const handleKeyPress = (e: KeyboardEvent) => {
    if (isAnimating) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleSwipe('left', 'unliked');
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleSwipe('right', 'liked');
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleSwipe('up');
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAnimating]);

  // ── 터치/마우스 시작 & 끝 처리 ────────────────────────────────────
  const onPointerDown = (e: React.PointerEvent) => {
    if (isAnimating) return;
    startPoint.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!startPoint.current) return;
    const dx = e.clientX - startPoint.current.x;
    const dy = e.clientY - startPoint.current.y;
    startPoint.current = null;
    const absX = Math.abs(dx),
      absY = Math.abs(dy),
      threshold = 150;
    if (absX > absY && absX > threshold) {
      handleSwipe(dx > 0 ? 'right' : 'left', dx > 0 ? 'liked' : 'unliked');
    } else if (dy < -threshold) {
      handleSwipe('up');
    }
  };

  // ── transform 클래스 계산 ──────────────────────────────────────────
  const getCardTransform = () => {
    if (!swipeDirection) return '';
    switch (swipeDirection) {
      case 'left':
        return 'translate-x-[-100vw] rotate-[-30deg]';
      case 'right':
        return 'translate-x-[100vw] rotate-[30deg]';
      case 'up':
        return 'translate-y-[-100vh]';
    }
  };

  // ── 렌더링 ─────────────────────────────────────────────────────────
  if (currentIndex >= MockMovies.length) return null;

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full px-6 pt-4 text-white">
      {/* 카드 위 문구 */}
      <div className="text-center space-y-2 mb-2">
        <p className="text-sm text-white/80">{`${currentIndex + 1} / 2`}</p>
        <h2 className="text-xl font-semibold leading-relaxed">
          한번 시도해볼까요?
        </h2>
      </div>

      {/* 카드 아래 안내 문구 */}
      <div className="text-center space-y-2 z-30">
        <p className="text-sm text-white/80">
          좌 우 아래 스와이프로 취향 반영 <br />
          카드를 직접 끌거나 키보드 방향키로 직접 해보아요!!
        </p>
      </div>

      <div className="my-8 flex w-full justify-center">
        <div></div>
        <div
          className={`relative w-[80vw] min-w-[280px] max-w-[320px] aspect-[75/135] md:max-w-[400px] sm:aspect-[75/127] max-h-[70vh] select-none ${
            isFlipped ? 'touch-action-auto' : 'touch-action-none'
          }`}
          style={{
            touchAction: isFlipped ? 'auto' : 'none',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none',
          }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (startPoint.current = null)}
        >
          {/* 자리 채우기 티켓 */}
          <div className="relative flex w-full aspect-[75/135] max-w-100 max-h-180 invisible pointer-events-none items-center justify-center">
            <Ticket movie={currentMovie} variant="initial" feedback="neutral" />
          </div>

          {/* 다음 카드 peek */}
          {nextMovie && (
            <div
              className={`absolute inset-0 z-10 flex items-center justify-center opacity-50 blur-sm pointer-events-none transition-transform duration-200 ${
                isAnimating
                  ? 'translate-y-2 scale-90'
                  : 'translate-y-0 scale-100'
              }`}
            >
              <Ticket movie={nextMovie} variant="initial" feedback="neutral" />
            </div>
          )}

          {/* 현재 카드 */}
          <div
            className={`absolute inset-0 z-20 flex items-center justify-center transition-transform ${
              swipeDirection
                ? `duration-700 ease-in ${getCardTransform()}`
                : `duration-100 ease-out ${
                    isAnimating
                      ? 'scale-90 translate-y-2 opacity-50 blur-sm'
                      : 'scale-100 translate-y-0 opacity-100'
                  }`
            }`}
            style={{ perspective: '1000px' }}
          >
            <div
              className={`relative w-full h-full transition-opacity duration-300 ${
                isAnimating ? 'opacity-0' : 'opacity-100'
              }`}
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
                    variant="initial"
                    feedback={feedback}
                  />
                </div>
                {/* Back */}
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
    </div>
  );
}
