'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Ticket } from '@components/Ticket/Ticket';
import { Button } from '@components/ui/button';
import { showInteractiveToast } from '@components/common/Toast';
import { postFeedbackContent } from '@lib/apis/recommend/postFeedbackContent';
import { useRecommendStore } from '@store/useRecommendStore';
import { useFetchRecommendations } from '@hooks/recommend/useGetRecommendationContents';
import { useRefreshCuratedContents } from '@hooks/recommend/useGetCuratedContents';
import { FinishScreen } from './FinishScreen';
import { sendAnalyticsEvent } from '@lib/gtag';
import { LoadingScreen } from './LoadingScreen';
import { toast } from 'sonner';

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

  const { forceRefresh } = useRefreshCuratedContents();
  const hasInitialized = useRef(false);

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
  const [loadingDelayOver, setLoadingDelayOver] = useState(false);

  // ── 로딩 지연 상태 관리 ──────────────────────────
  useEffect(() => {
    // 기존 데이터가 있으면 로딩 지연 건너뛰기
    if (moviePool.length > 0) {
      setLoadingDelayOver(true);
    }
  }, [moviePool.length]);

  // ── 초기 데이터 로드 ────────────────────────────
  useEffect(() => {
    const loadInitialMovies = async () => {
      // 이미 초기화되었거나 기존 데이터가 있으면 스킵
      if (hasInitialized.current || moviePool.length > 0) {
        setLoadingDelayOver(true);
        return;
      }

      hasInitialized.current = true; // 초기화 플래그 설정

      try {
        const [initialMovies] = await Promise.all([
          fetchRecommendations(10),
          new Promise((resolve) => setTimeout(resolve, 2000)),
        ]);

        setMoviePool(initialMovies);
        setLoadingDelayOver(true);
      } catch (error) {
        console.error('초기 콘텐츠 로딩 실패:', error);
        hasInitialized.current = false; // 실패 시 플래그 리셋
        setTimeout(() => setLoadingDelayOver(true), 2000);
      }
    };

    loadInitialMovies();
  }, []);

  // 현재 영화 정보
  const currentMovie = getCurrentMovie();
  const nextMovie = getNextMovie();

  useEffect(() => {
    const loadMoreMovies = async () => {
      if (!shouldLoadMoreContent()) return;

      try {
        const newMovies = await fetchRecommendations(10);
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
      await postFeedbackContent(feedbackData);
    } catch {
      // 에러 발생 시에도 사일런트 처리
    }
  };

  // ── 스와이프 처리 ─────────────────────────────
  const handleSwipe = async (
    direction: SwipeDirection,
    feedbackType?: FeedbackType,
  ): Promise<void> => {
    if (isAnimating || isFlipped) return;

    // GA4로 스와이프 이벤트 전송 (Google Analytics 연동을 위함)
    sendAnalyticsEvent('swipe_action_in_reels', {
      direction, // left, right, up
      feedback: feedbackType ?? 'neutral',
      content_id: currentMovie ? currentMovie.contentId : 9999999,
      page: 'recommend_screen',
      swipe_count: swipeCount + 1, // 0-index면 +1
      timestamp: new Date().toISOString(),
    });

    setIsAnimating(true);
    setSwipeDirection(direction);
    if (feedbackType) setFeedback(feedbackType);
    setIsFlipped(false);

    // 즉시 피드백 전송 (현재 콘텐츠에 대해)
    if (feedbackType && currentMovie) {
      sendFeedbackImmediately(currentMovie.contentId, feedbackType);
    }

    // 애니메이션 정리는 기존대로
    setTimeout(() => {
      incrementSwipeCount();
      setCurrentIndex(currentIndex + 1);
      setSwipeDirection(null);
      setFeedback('neutral');
      setIsAnimating(false);
    }, 700);
  };

  // ── 일정 횟수 스와이프 후 토스트 표시 ──────────────
  useEffect(() => {
    const SWIPE_THRESHOLD = 20;

    if (swipeCount >= SWIPE_THRESHOLD && !shouldShowFinish() && !toastShown) {
      setToastShown(true);

      showInteractiveToast.action({
        message: '컨텐츠 추천이 준비되었습니다!\n추천 결과를 보시겠어요?',
        actionText: '결과 보기',
        duration: Infinity,
        position: 'top-center',
        className: 'bg-gray-500',
        onAction: async () => {
          try {
            // 새로운 강제 refresh 사용
            await forceRefresh();
            setResultReady(true);
            onComplete();
          } catch (error) {
            console.error('큐레이션 콘텐츠 새로고침 실패:', error);
            setResultReady(true);
            onComplete();
          }
        },
        onClose: () => {
          resetSwipeCount();
          setToastShown(false);
          setResultReady(false);
        },
      });
    }
  }, [
    swipeCount,
    resultReady,
    toastShown,
    onComplete,
    resetSwipeCount,
    forceRefresh,
  ]);

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
        handleSwipe('up', 'neutral');
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
      handleSwipe('up', 'neutral');
    }
  };

  const onTouchStart = (e: React.TouchEvent): void => {
    if (isAnimating || e.touches.length !== 1 || isFlipped) return;
    e.preventDefault();
    const touch = e.touches[0];
    setStartPoint({ x: touch.clientX, y: touch.clientY });
  };

  const onTouchEnd = (e: React.TouchEvent): void => {
    if (!startPoint || e.changedTouches.length !== 1 || isFlipped) return;
    e.preventDefault();
    const touch = e.changedTouches[0];
    const dx: number = touch.clientX - startPoint.x;
    const dy: number = touch.clientY - startPoint.y;
    setStartPoint(null);
    const absX: number = Math.abs(dx);
    const absY: number = Math.abs(dy);
    const threshold: number = 100; // 모바일에 맞게 임계값 낮춤

    if (absX > absY && absX > threshold) {
      handleSwipe(dx > 0 ? 'right' : 'left', dx > 0 ? 'liked' : 'unliked');
    } else if (dy < -threshold) {
      handleSwipe('up', 'neutral');
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
      const movies = await fetchRecommendations(10);
      setMoviePool(movies);
    } catch (error) {
      console.error('재시도 실패:', error);
    }
  };

  if (shouldShowFinish()) {
    toast.dismiss();
    return <FinishScreen />;
  }

  // ── 로딩 상태 ─────────────────────────────────
  if (!loadingDelayOver || (isLoading && moviePool.length === 0)) {
    return (
      <LoadingScreen
        message="컨텐츠 목록을 불러오고 있어요!"
        submessage="잠시만 기다려주세요...."
      />
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
    <div className="flex flex-col w-full h-full items-center justify-center">
      <div className="my-5 flex w-full justify-center">
        <div></div>
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
          onPointerUp={onPointerUp}
          onPointerCancel={() => setStartPoint(null)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onTouchCancel={() => setStartPoint(null)}
        >
          {/* 자리 채우기 티켓 */}
          <div className="relative flex w-full h-[70vh] aspect-[75/135] min-w-70 min-h-110 max-w-100 max-h-180 invisible pointer-events-none items-center justify-center">
            <Ticket
              key={currentMovie.contentId}
              movie={currentMovie}
              variant="initial"
              feedback="neutral"
            />
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
              <Ticket
                key={nextMovie.contentId}
                movie={nextMovie}
                variant="initial"
                feedback="neutral"
              />
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
                    key={currentMovie.contentId}
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
                  <Ticket
                    key={currentMovie.contentId}
                    movie={currentMovie}
                    variant="detail"
                  />
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
      </div>
    </div>
  );
}
