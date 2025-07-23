'use client';

import React, { useState, useEffect } from 'react';
import { Ticket } from '@components/Ticket/Ticket';
import { Button } from '@components/ui/button';
import { showInteractiveToast } from '@components/common/Toast';
import { postFeedbackContent } from '@lib/apis/recommend/postFeedbackContent';
import { useRecommendStore } from '@store/useRecommendStore';
import { useFetchRecommendations } from '@hooks/recommend/useGetRecommendationContents';
import { FinishScreen } from './FinishScreen';
import { sendAnalyticsEvent } from '@lib/gtag';

type SwipeDirection = 'left' | 'right' | 'up';
type FeedbackType = 'liked' | 'unliked' | 'neutral';

export interface RecommendProps {
  onComplete: () => void;
}

export function RecommendScreen({ onComplete }: Readonly<RecommendProps>) {
  // Zustand store에서 상태와 액션들 가져오기
  const {
    moviePool,
    currentIndex,
    swipeCount,
    setMoviePool,
    addMoviesToPool,
    setCurrentIndex,
    incrementSwipeCount,
    resetSwipeCount,
    getCurrentMovie,
    getNextMovie,
    shouldLoadMoreContent,
    shouldShowFinish,
  } = useRecommendStore();

  // TanStack Query: 추천 콘텐츠 가져오기
  const {
    mutateAsync: fetchRecommendations,
    isPending: isLoading,
    error: fetchError,
  } = useFetchRecommendations();

  // 로컬 UI 상태들 (애니메이션 관련은 persist 불필요)
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection | null>(
    null,
  );
  const [feedback, setFeedback] = useState<FeedbackType>('neutral');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [resultReady, setResultReady] = useState<boolean>(false);
  const [toastShown, setToastShown] = useState<boolean>(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null,
  );

  // ── 초기 데이터 로드 ────────────────────────────
  useEffect(() => {
    const loadInitialMovies = async () => {
      if (moviePool.length > 0) {
        console.log('기존 진행 상황 복원:', {
          movieCount: moviePool.length,
          currentIndex,
          swipeCount,
        });
        return;
      }

      try {
        console.log('초기 콘텐츠 로딩 시작...');
        const initialMovies = await fetchRecommendations(10);
        console.log(
          `${initialMovies.length}개의 초기 콘텐츠가 로드되었습니다.`,
        );
        setMoviePool(initialMovies);
      } catch (error) {
        console.error('초기 콘텐츠 로딩 실패:', error);
      }
    };

    loadInitialMovies();
  }, []); // 빈 의존성 배열 - 한 번만 실행

  // 현재 영화 정보
  const currentMovie = getCurrentMovie();
  const nextMovie = getNextMovie();

  // ── 추가 콘텐츠 로드 (5개마다) ───────────────
  useEffect(() => {
    const loadMoreMovies = async () => {
      if (!shouldLoadMoreContent()) return;

      try {
        console.log(`currentIndex ${currentIndex}: 추가 콘텐츠 로딩 시작...`);
        const newMovies = await fetchRecommendations(5);
        console.log(`${newMovies.length}개의 새로운 영화가 추가되었습니다.`);
        addMoviesToPool(newMovies);
      } catch (error) {
        console.error('추가 영화 로드 실패:', error);
        // 추가 로드 실패는 조용히 처리 (사용자 방해하지 않음)
      }
    };

    loadMoreMovies();
  }, [
    currentIndex,
    shouldLoadMoreContent,
    addMoviesToPool,
    fetchRecommendations,
  ]);

  // ── 즉시 피드백 전송 함수 ──────────────────────
  const sendFeedbackImmediately = async (
    contentId: number,
    feedbackType: FeedbackType,
  ): Promise<void> => {
    let feedbackValue: string;

    switch (feedbackType) {
      case 'liked':
        feedbackValue = 'LIKE';
        break;
      case 'unliked':
        feedbackValue = 'DISLIKE';
        break;
      case 'neutral':
        feedbackValue = 'UNINTERESTED';
        break;
      default:
        feedbackValue = 'UNINTERESTED';
    }

    const feedbackData = [{ contentId, feedback: feedbackValue }];

    try {
      console.log('피드백 즉시 전송:', feedbackData);
      const result = await postFeedbackContent(feedbackData);

      if (result.success) {
        console.log('피드백 전송 성공:', result.message);
      } else {
        console.warn('피드백 전송 실패:', result.message);
      }
    } catch (error: unknown) {
      console.error('피드백 전송 중 오류:', error);
    }
  };

  // ── 스와이프 처리 ─────────────────────────────
  const handleSwipe = async (
    direction: SwipeDirection,
    feedbackType?: FeedbackType,
  ): Promise<void> => {
    if (isAnimating || isFlipped || !currentMovie) return;

    // GA4로 스와이프 이벤트 전송 (Google Analytics 연동을 위함)
    sendAnalyticsEvent('swipe_action_in_reels', {
      direction, // left, right, up
      feedback: feedbackType ?? 'neutral',
      content_id: currentMovie.contentId,
      page: 'recommend_screen',
      swipe_count: swipeCount + 1, // 0-index면 +1
      timestamp: new Date().toISOString(),
    });

    setIsAnimating(true);
    setSwipeDirection(direction);
    if (feedbackType) setFeedback(feedbackType);
    setIsFlipped(false);

    // 즉시 피드백 전송
    if (feedbackType && currentMovie) {
      sendFeedbackImmediately(currentMovie.contentId, feedbackType);
    }

    // Store 업데이트
    incrementSwipeCount();

    // 애니메이션 → 인덱스 이동
    setTimeout(() => {
      setSwipeDirection(null);
      setCurrentIndex(currentIndex + 1);
      setFeedback('neutral');
    }, 700);

    // 애니메이션 잠금 해제
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
    console.log(moviePool);
  };

  // ── 일정 횟수 스와이프 후 토스트 표시 ──────────────
  useEffect(() => {
    const SWIPE_THRESHOLD = 5;

    if (swipeCount >= SWIPE_THRESHOLD && !shouldShowFinish() && !toastShown) {
      setToastShown(true);

      showInteractiveToast.action({
        message: '컨텐츠 추천이 준비되었습니다!\n추천 결과를 보시겠어요?',
        actionText: '결과 보기',
        duration: Infinity,
        position: 'top-center',
        className: 'bg-gray-500',
        onAction: () => {
          setResultReady(true);
          onComplete();
        },
        onClose: () => {
          resetSwipeCount();
          setToastShown(false);
          setResultReady(false);
        },
      });
    }
  }, [swipeCount, resultReady, toastShown, onComplete, resetSwipeCount]);

  // ── 키보드 이벤트 처리 ────────────────────────
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
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

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAnimating, isFlipped, currentIndex]);

  // ── 터치/마우스 이벤트 처리 ───────────────────
  const onPointerDown = (e: React.PointerEvent): void => {
    if (isAnimating) return;
    setStartPoint({ x: e.clientX, y: e.clientY });
  };

  const onPointerUp = (e: React.PointerEvent): void => {
    if (!startPoint) return;
    const dx: number = e.clientX - startPoint.x;
    const dy: number = e.clientY - startPoint.y;
    setStartPoint(null);
    const absX: number = Math.abs(dx);
    const absY: number = Math.abs(dy);
    const threshold: number = 150;

    if (absX > absY && absX > threshold) {
      handleSwipe(dx > 0 ? 'right' : 'left', dx > 0 ? 'liked' : 'unliked');
    } else if (dy < -threshold) {
      handleSwipe('up');
    }
  };

  // ── transform 클래스 계산 ──────────────────────
  const getCardTransform = (): string => {
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

  // ── 에러 처리 ─────────────────────────────────
  const handleRetry = async () => {
    try {
      const movies = await fetchRecommendations(5);
      setMoviePool(movies);
    } catch (error) {
      console.error('재시도 실패:', error);
    }
  };

  if (shouldShowFinish()) {
    return <FinishScreen />;
  }

  // ── 로딩 상태 ─────────────────────────────────
  if (isLoading && moviePool.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="text-white text-lg">콘텐츠를 로딩 중...</div>
      </div>
    );
  }

  // ── 에러 상태 ─────────────────────────────────
  if (fetchError && moviePool.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="text-white text-lg mb-4">
          콘텐츠를 불러올 수 없습니다
        </div>
        <Button
          onClick={handleRetry}
          variant="outline"
          className="text-white border-white"
        >
          다시 시도
        </Button>
      </div>
    );
  }

  // ── 콘텐츠 없음 ───────────────────────────────
  if (!currentMovie) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="text-white text-lg">콘텐츠를 로딩 중...</div>
      </div>
    );
  }

  // ── 렌더링 ─────────────────────────────────────
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="my-8 flex w-full justify-center">
        <div></div>
        <div
          className={`relative inline-block mx-10 w-full select-none ${
            isFlipped ? 'touch-action-auto' : 'touch-action-none'
          }`}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => setStartPoint(null)}
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
          onClick={() => setIsFlipped((f: boolean) => !f)}
          variant="outline"
          className="bg-white/20 border-white/20 text-white px-5 py-2 text-sm hover:bg-white/20 backdrop-blur-sm"
        >
          {isFlipped ? '돌아가기' : '상세보기'}
        </Button>

        {/* 진행률 표시 */}
        <div className="text-white/70 text-sm">
          진행률: {swipeCount}/5
          {isLoading && <span className="ml-2">(추가 로딩 중...)</span>}
        </div>
      </div>
    </div>
  );
}
