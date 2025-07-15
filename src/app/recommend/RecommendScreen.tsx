'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Ticket } from '@components/Ticket/Ticket';
import { dummyMovies } from './moviedata';
import { Button } from '@components/ui/button';
import { showInteractiveToast } from '@components/common/Toast';

type SwipeDirection = 'left' | 'right' | 'up';
type FeedbackType = 'liked' | 'unliked' | 'neutral';

export interface RecommendProps {
  onComplete: () => void;
}

export function RecommendScreen({ onComplete }: RecommendProps) {
  // ── 상태 ─────────────────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextMovie, setNextMovie] = useState(
    dummyMovies.length > 1 ? dummyMovies[1] : null,
  );
  const [isFlipped, setIsFlipped] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection | null>(
    null,
  );
  const [feedback, setFeedback] = useState<FeedbackType>('neutral');
  const [isAnimating, setIsAnimating] = useState(false);
  const startPoint = useRef<{ x: number; y: number } | null>(null);
  const [resultReady, setResultReady] = useState(false);

  const currentMovie = dummyMovies[currentIndex];

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

  // ── 다음 카드 갱신 ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isAnimating) {
      const nextIdx = currentIndex + 1;
      setNextMovie(dummyMovies[nextIdx] ?? null);
    }
  }, [isAnimating, currentIndex]);

  // ── 절반 넘으면 한 번만 결과 호출 ───────────────────────────────────
  useEffect(() => {
    if (currentIndex >= dummyMovies.length / 2 && !resultReady) {
      showInteractiveToast.action({
        message: '모든 영화를 확인했습니다!\n추천 결과를 보시겠어요?',
        actionText: '결과 보기',
        duration: Infinity,
        position: 'top-center',
        className: 'bg-gray-500',
        onAction: () => {
          setResultReady(true);
          onComplete();
        },
      });
    }
  }, [currentIndex, resultReady, onComplete]);

  // ── 키보드 스와이프 지원 ────────────────────────────────────────────
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
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleSwipe('up');
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAnimating, isFlipped]);

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
  if (currentIndex >= dummyMovies.length) return null;

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="text-lg">
        <p>테스트용 </p>
      </div>
      <div className="my-8 flex w-full justify-center">
        <div></div>
        <div
          className={`relative inline-block mx-10 w-full select-none ${
            isFlipped ? 'touch-action-auto' : 'touch-action-none'
          }`}
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

      {/* 플립 버튼 */}
      <div className="relative z-30 flex flex-col items-center gap-4">
        <Button
          onClick={() => setIsFlipped((f) => !f)}
          variant="outline"
          className=" bg-white/20 border-white/20 text-white px-5                                                                                    py-2 text-sm hover:bg-white/20 backdrop-blur-sm"
        >
          {isFlipped ? '돌아가기' : '상세보기'}
        </Button>
      </div>
    </div>
  );
}
