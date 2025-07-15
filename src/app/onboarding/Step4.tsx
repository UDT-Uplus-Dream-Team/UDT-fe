'use client';

import { useState, useEffect, useRef } from 'react';
import { Ticket } from '@components/Ticket/Ticket';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { dummyMovies } from '../recommend/moviedata';

interface StepProps {
  onNext: () => void;
}

type FeedbackType = 'neutral' | 'liked' | 'unliked';
type SwipeDirection = 'left' | 'right' | 'up' | null;

export default function Step4({ onNext }: StepProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackType>('neutral');
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const startPoint = useRef<{ x: number; y: number } | null>(null);

  const currentMovie = dummyMovies[currentIndex];

  const handleSwipe = (
    direction: SwipeDirection,
    feedbackType?: FeedbackType,
  ) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSwipeDirection(direction);
    if (feedbackType) setFeedback(feedbackType);

    setTimeout(() => {
      setSwipeDirection(null);
      setCurrentIndex((prev) => prev + 1);
      setFeedback('neutral');
    }, 700);

    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  useEffect(() => {
    if (currentIndex >= 2) {
      onNext();
    }
  }, [currentIndex, onNext]);

  // 키보드 이벤트 리스너 등록
  useEffect(() => {
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
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAnimating]);

  // 터치/마우스 스와이프
  const onPointerDown = (e: React.PointerEvent) => {
    if (isAnimating) return;
    startPoint.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!startPoint.current) return;
    const dx = e.clientX - startPoint.current.x;
    const dy = e.clientY - startPoint.current.y;
    startPoint.current = null;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const threshold = 120;
    if (absX > absY && absX > threshold) {
      handleSwipe(dx > 0 ? 'right' : 'left', dx > 0 ? 'liked' : 'unliked');
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-b from-[#0b0c32] via-[#4b3381] to-[#a96fd1] text-white"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <div className="text-center space-y-2 mb-4">
        <p className="text-sm text-white/80">{`${currentIndex + 1} / 2`}</p>
        <h2 className="text-xl font-semibold leading-relaxed">
          한번 시도해볼까요?
        </h2>
      </div>

      {/* 카드 영역 */}
      <div className="relative w-full max-w-[320px] aspect-[75/135] mb-6 transition-transform duration-500 ease-in-out">
        <div
          className={clsx(
            swipeDirection === 'left' && 'animate-swipe-left',
            swipeDirection === 'right' && 'animate-swipe-right',
          )}
        >
          <Ticket movie={currentMovie} variant="initial" feedback={feedback} />
        </div>

        {/* 방향 아이콘 */}
        <ArrowLeft
          className={clsx(
            'absolute left-[-28px] top-1/2 -translate-y-1/2 w-6 h-6 animate-bounce',
            feedback === 'unliked' ? 'text-red-400' : 'text-white/70',
          )}
        />
        <ArrowRight
          className={clsx(
            'absolute right-[-28px] top-1/2 -translate-y-1/2 w-6 h-6 animate-bounce',
            feedback === 'liked' ? 'text-green-400' : 'text-white/70',
          )}
        />
      </div>
    </div>
  );
}
