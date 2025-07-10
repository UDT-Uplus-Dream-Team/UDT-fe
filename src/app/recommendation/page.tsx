'use client';

import { useState, useEffect } from 'react';
import { Ticket } from '@components/Ticket/Ticket';
import { dummyMovies } from './moviedata';
import { Button } from '@components/ui/button';

type SwipeDirection = 'left' | 'right' | 'up';
type FeedbackType = 'liked' | 'unliked' | 'neutral';

export default function MovieSwipePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection | null>(
    null,
  );
  const [feedback, setFeedback] = useState<FeedbackType>('neutral');
  const [isAnimating, setIsAnimating] = useState(false);

  const currentMovie = dummyMovies[currentIndex];
  const hasNextMovie = currentIndex < dummyMovies.length - 1;

  const handleSwipe = (
    direction: SwipeDirection,
    feedbackType?: FeedbackType,
  ) => {
    if (isAnimating || !hasNextMovie) return;

    setIsAnimating(true);
    setSwipeDirection(direction);
    if (feedbackType) {
      setFeedback(feedbackType);
    }

    // Reset flip state when swiping
    setIsFlipped(false);

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setSwipeDirection(null);
      setFeedback('neutral');
      setIsAnimating(false);
    }, 600);
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (isAnimating) return;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        handleSwipe('left', 'unliked');
        break;
      case 'ArrowRight':
        event.preventDefault();
        handleSwipe('right', 'liked');
        break;
      case 'ArrowDown':
        event.preventDefault();
        handleSwipe('up');
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAnimating, hasNextMovie]);

  const getCardTransform = () => {
    if (!swipeDirection) return '';

    switch (swipeDirection) {
      case 'left':
        return 'translate-x-[-100vw] rotate-[-30deg]';
      case 'right':
        return 'translate-x-[100vw] rotate-[30deg]';
      case 'up':
        return 'translate-y-[-100vh]';
      default:
        return '';
    }
  };

  if (currentIndex >= dummyMovies.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4">모든 영화를 확인했습니다!</h1>
          <p className="text-lg mb-6">추천 결과를 확인해보세요.</p>
          <Button
            onClick={() => {
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className="bg-white text-purple-900 hover:bg-gray-100"
          >
            다시 시작하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex flex-col items-center justify-center p-4">
      {/* Progress indicator */}
      <div className="mb-6 text-white text-center">
        <div className="text-sm opacity-80">
          {currentIndex + 1} / {dummyMovies.length}
        </div>
      </div>
      {/* Card container */}
      <div className="mb-8 flex justify-center">
        <div className="relative inline-block">
          <div className="invisible">
            <Ticket movie={currentMovie} variant="initial" feedback="neutral" />
          </div>
          {/* ── 다음 카드(peek) ── */}
          {hasNextMovie && (
            <div className="absolute inset-0 z-10 transform translate-y-2 scale-95 opacity-50">
              <Ticket
                movie={dummyMovies[currentIndex + 1]}
                variant="initial"
                feedback="neutral"
              />
            </div>
          )}

          {/* ── 현재 카드(swipe + flip) ── */}
          <div
            className={`
        absolute inset-0 z-20
        transition-all duration-1500 ease-out
        ${swipeDirection ? getCardTransform() : ''}
      `}
            style={{ perspective: '1000px' }}
          >
            <div
              className="relative w-full h-full transition-transform duration-500"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Front side */}
              <div
                className={`absolute inset-0 transition-opacity duration-300 ${
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

              {/* Back side */}
              <div
                className={`absolute inset-0 transition-opacity duration-300 ${
                  isFlipped ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <Ticket movie={currentMovie} variant="detail" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Controls */}
      <div className="relative z-30 flex flex-col items-center gap-4 mt-4">
        <Button
          onClick={() => setIsFlipped(!isFlipped)}
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
        >
          {isFlipped ? '돌아가기' : '상세보기'}
        </Button>

        <div className="flex gap-4">
          <Button
            onClick={() => handleSwipe('left', 'unliked')}
            disabled={isAnimating || !hasNextMovie}
            variant="outline"
            className="bg-red-500/20 border-red-400/30 text-white hover:bg-red-500/30 backdrop-blur-sm"
          >
            싫어요 (←)
          </Button>
          <Button
            onClick={() => handleSwipe('up', 'neutral')}
            disabled={isAnimating || !hasNextMovie}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            건너뛰기 (↓)
          </Button>
          <Button
            onClick={() => handleSwipe('right', 'liked')}
            disabled={isAnimating || !hasNextMovie}
            variant="outline"
            className="bg-green-500/20 border-green-400/30 text-white hover:bg-green-500/30 backdrop-blur-sm"
          >
            좋아요 (→)
          </Button>
        </div>
      </div>
      {/* Instructions */}
      <div className="mt-8 text-center text-white/70 text-sm">
        <p>키보드 화살표 키로도 조작할 수 있습니다</p>
        <p>← 싫어요 | → 좋아요 | ↓ 건너뛰기</p>
      </div>
    </div>
  );
}
