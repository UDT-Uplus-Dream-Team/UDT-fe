'use client';

import React, { useState, useEffect } from 'react';
import { Ticket } from '@components/Ticket/Ticket';
import { Button } from '@components/ui/button';
import { showInteractiveToast } from '@components/common/Toast';
import { fetchMoreContents, getAvailableContents } from './RecommendContent';
import { postFeedbackContent } from '@lib/apis/recommend/postFeedbackContent';
import { useRecommendStore } from '@/store/useRecommendStore';

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
    getCurrentMovie,
    getNextMovie,
    shouldLoadMoreContent,
  } = useRecommendStore();

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

  // ── 초기 데이터 로드 또는 기존 상태 복원 ────────────────────────────
  useEffect(() => {
    const initializeContent = async () => {
      // 이미 영화 데이터가 있다면 복원, 없다면 새로 로드
      if (moviePool.length === 0) {
        try {
          console.log('초기 콘텐츠 로딩 시작...');
          const initialMovies = getAvailableContents();
          console.log(
            `${initialMovies.length}개의 초기 콘텐츠가 로드되었습니다.`,
          );
          setMoviePool(initialMovies);
        } catch (error: unknown) {
          console.error('초기 콘텐츠 로딩 실패:', error);
        }
      } else {
        console.log('기존 진행 상황 복원:', {
          movieCount: moviePool.length,
          currentIndex,
          swipeCount,
        });
      }
    };

    initializeContent();
  }, []); // 빈 의존성 배열 - 한 번만 실행

  // 현재 영화 정보
  const currentMovie = getCurrentMovie();
  const nextMovie = getNextMovie();

  // ── currentIndex가 5의 배수일 때마다 새로운 콘텐츠 추가 ───────────────
  useEffect(() => {
    const loadMoreContents = async () => {
      if (shouldLoadMoreContent()) {
        try {
          console.log(`currentIndex ${currentIndex}: 추가 콘텐츠 로딩 시작...`);
          const newMovies = await fetchMoreContents();
          console.log(`${newMovies.length}개의 새로운 영화가 추가되었습니다.`);
          addMoviesToPool(newMovies);
        } catch (error: unknown) {
          console.error('영화 데이터 추가 실패:', error);
        }
      }
    };

    loadMoreContents();
  }, [currentIndex, shouldLoadMoreContent, addMoviesToPool]);

  // ── 즉시 피드백 전송 함수 ──────────────────────────────────────────
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

  // ── 스와이프 처리 ─────────────────────────────────────────────────
  const handleSwipe = async (
    direction: SwipeDirection,
    feedbackType?: FeedbackType,
  ): Promise<void> => {
    if (isAnimating || isFlipped || !currentMovie) return;

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
  };

  // ── 10번 스와이프 후 토스트 표시 ──────────────────────────────────────
  useEffect(() => {
    const SWIPE_THRESHOLD = 10;

    if (swipeCount >= SWIPE_THRESHOLD && !resultReady && !toastShown) {
      setToastShown(true);

      showInteractiveToast.action({
        message: '컨텐츠 추천이 준비되었습니다!\n추천 결과를 보시겠어요?',
        actionText: '결과 보기',
        duration: Infinity,
        position: 'top-center',
        className: 'bg-gray-500',
        onAction: async () => {
          setResultReady(true);
          onComplete();
        },
        onClose: () => {
          setToastShown(false);
          setResultReady(false);
        },
      });
    }
  }, [swipeCount, resultReady, toastShown, onComplete]);

  // ── 키보드 이벤트 처리 ────────────────────────────────────────────
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

  // ── 터치/마우스 이벤트 처리 ───────────────────────────────────────────
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

  // ── transform 클래스 계산 ──────────────────────────────────────────
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

  // ── 렌더링 ─────────────────────────────────────────────────────────
  if (!currentMovie) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="text-white text-lg">콘텐츠를 로딩 중...</div>
      </div>
    );
  }

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
          className=" bg-white/20 border-white/20 text-white px-5 py-2 text-sm hover:bg-white/20 backdrop-blur-sm"
        >
          {isFlipped ? '돌아가기' : '상세보기'}
        </Button>
      </div>
    </div>
  );
}
