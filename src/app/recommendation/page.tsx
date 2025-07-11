'use client';

import { useState, useEffect, useRef } from 'react';
import { Ticket } from '@components/Ticket/Ticket';
import { dummyMovies } from './moviedata';
import { useRouter } from 'next/navigation';
import { Button } from '@components/ui/button';
import { showInteractiveToast } from '@components/common/Toast';

type SwipeDirection = 'left' | 'right' | 'up';
type FeedbackType = 'liked' | 'unliked' | 'neutral';

export default function MovieSwipePage() {
  const router = useRouter();
  // 현재 보여주는 영화의 인덱스
  const [currentIndex, setCurrentIndex] = useState(0);
  // 다음에 보여줄 영화 데이터 스냅샷
  const [nextMovie, setNextMovie] = useState(
    dummyMovies.length > 1 ? dummyMovies[1] : null,
  );
  // 카드가 뒤집힌 상태인지
  const [isFlipped, setIsFlipped] = useState(false);
  // 스와이프 방향: 'left' | 'right' | 'up' | null
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection | null>(
    null,
  );
  // 피드백 타입: liked, unliked, neutral
  const [feedback, setFeedback] = useState<FeedbackType>('neutral');
  // 전체 애니메이션 진행 중 여부
  const [isAnimating, setIsAnimating] = useState(false);

  // 터치/마우스 시작 지점 저장
  const startPoint = useRef<{ x: number; y: number } | null>(null);

  const [showResults, setShowResults] = useState(false);

  const currentMovie = dummyMovies[currentIndex];
  const hasNextMovie = currentIndex < dummyMovies.length - 1;

  /**
   * 스와이프 처리 함수
   * direction: 'left' | 'right' | 'up'
   * feedbackType: 좋아요/싫어요 상태
   */
  const handleSwipe = (
    direction: SwipeDirection,
    feedbackType?: FeedbackType,
  ) => {
    // 이미 애니메이션 중이거나 뒤집힌 상태, 또는 다음 카드가 없으면 무시
    if (isAnimating || isFlipped) return;

    setIsAnimating(true);
    setSwipeDirection(direction);
    if (feedbackType) setFeedback(feedbackType);
    setIsFlipped(false);

    // 400ms 뒤: 스와이프 애니메이션 완료 → 방향·인덱스·피드백 초기화
    setTimeout(() => {
      setSwipeDirection(null);
      setCurrentIndex((prev) => prev + 1);
      setFeedback('neutral');
    }, 700);

    // 추가 200ms 뒤: 등장 애니메이션 완료 → 애니메이션 잠금 해제
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  // currentIndex 또는 애니메이션 상태 변경 시 다음 카드를 갱신
  useEffect(() => {
    if (!isAnimating) {
      const nextIdx = currentIndex + 1;
      setNextMovie(nextIdx < dummyMovies.length ? dummyMovies[nextIdx] : null);
    }
  }, [isAnimating, currentIndex]);

  useEffect(() => {
    if (currentIndex >= dummyMovies.length) {
      showInteractiveToast.action({
        message: '모든 영화를 확인했습니다! 추천 결과를 보시겠어요?',
        actionText: '결과 보기',
        duration: 10000,
        position: 'top-center',
        className: 'bg-gray-40',
        onAction: () => {
          setShowResults(true);
        },
      });
    }
  }, [currentIndex]);

  useEffect(() => {
    if (showResults) {
      router.push('/recommendation/result');
    }
  }, [showResults, router]);

  /** 키보드 화살표로 스와이프 지원 (웹 PC용) */
  const handleKeyPress = (event: KeyboardEvent) => {
    // 애니메이션 중이거나 카드가 뒤집힌 상태에서는 키보드 스와이프 비활성화
    if (isAnimating || isFlipped) return;

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

  // 키 이벤트 리스너 등록/해제
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAnimating, isFlipped, hasNextMovie]); // isFlipped 의존성 추가

  /** 터치/마우스 시작 지점 기록 */
  const onPointerDown = (e: React.PointerEvent) => {
    if (isAnimating) return;
    startPoint.current = { x: e.clientX, y: e.clientY };
  };

  /** 터치/마우스 끝 지점 비교 후 스와이프 결정 */
  const onPointerUp = (e: React.PointerEvent) => {
    if (!startPoint.current) return;
    const dx = e.clientX - startPoint.current.x;
    const dy = e.clientY - startPoint.current.y;
    startPoint.current = null;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const threshold = 150; // 픽셀 기준

    if (absX > absY && absX > threshold) {
      // 좌우 스와이프
      handleSwipe(dx > 0 ? 'right' : 'left', dx > 0 ? 'liked' : 'unliked');
    } else if (dy < -threshold) {
      // 아래로 스와이프 → skip
      handleSwipe('up');
    }
  };

  /** 스와이프 방향에 따른 변환 클래스 반환 */
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
    return null;
  }

  // 메인 UI 렌더링
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* 진행 표시기 */}
      <div className="mb-6 text-white text-center">
        <div className="text-sm opacity-80">
          {currentIndex + 1} / {dummyMovies.length}
        </div>
      </div>
      {/* 카드 컨테이너 */}
      <div className="mb-8 flex justify-center">
        <div
          className={`relative inline-block select-none ${
            isFlipped ? 'touch-action-auto' : 'touch-action-none'
          }`}
          onPointerDown={(e) => {
            if (isFlipped) return; // 뒤집힌 상태에서는 스와이프 이벤트 무시
            onPointerDown(e);
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerUp={(e) => {
            if (isFlipped) return; // 뒤집힌 상태에서는 스와이프 이벤트 무시
            onPointerUp(e);
            e.currentTarget.releasePointerCapture(e.pointerId);
          }}
          onPointerCancel={(e) => {
            if (isFlipped) return; // 뒤집힌 상태에서는 스와이프 이벤트 무시
            startPoint.current = null;
            e.currentTarget.releasePointerCapture(e.pointerId);
          }}
        >
          {/* 보이지 않는 자리 채우기용 티켓 */}
          <div className="invisible pointer-events-none">
            <Ticket movie={currentMovie} variant="initial" feedback="neutral" />
          </div>
          {/* ── 다음 카드(peek) ── */}
          {nextMovie && (
            <div
              className={`
                absolute inset-0 z-10 opacity-50 blur-sm
                pointer-events-none
                transition-transform duration-200 linear
                ${
                  isAnimating
                    ? 'translate-y-2 scale-90' // 스와이프 중: 작게 아래로
                    : 'translate-y-0 scale-100' // 애니메이션 완료 후: 원래 크기
                }
              `}
            >
              <Ticket movie={nextMovie} variant="initial" feedback="neutral" />
            </div>
          )}
          {/* ── 현재 카드(swipe + flip + entry) ── */}
          <div
            className={`
              absolute inset-0 z-20
              ${
                swipeDirection
                  ? // → 스와이프 transform: 700ms 동안 천천히 translate/rotate
                    `transition-transform duration-700 ease-in ${getCardTransform()}`
                  : // → 등 장/reverse: 300ms 동안 scale·translate-y 처리
                    `transition-transform duration-100 ease-out ${
                      isAnimating
                        ? 'scale-90 translate-y-2 opacity-50 blur-sm'
                        : 'scale-100 translate-y-0 opacity-100'
                    }`
              }
            `}
            style={{ perspective: '1000px' }}
          >
            {/* 페이드 래퍼 */}
            <div
              className={`
                relative w-full h-full
                transition-opacity duration-300 linear
                ${isAnimating ? 'opacity-0' : 'opacity-100'}
              `}
            >
              {/* 플립 래퍼 */}
              <div
                className="relative w-full h-full"
                style={{
                  transformStyle: 'preserve-3d',
                  transition: 'transform 500ms linear',
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
                    pointerEvents: isFlipped ? 'auto' : 'none', // 뒤집힌 상태에서만 포인터 이벤트 허용
                    zIndex: isFlipped ? 30 : 10, // 뒤집힌 상태에서 더 높은 z-index
                  }}
                >
                  <Ticket movie={currentMovie} variant="detail" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-30 flex flex-col items-center gap-4 mt-4">
        <Button
          onClick={() => setIsFlipped(!isFlipped)}
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
        >
          {isFlipped ? '돌아가기' : '상세보기'}
        </Button>
      </div>
    </div>
  );
}
