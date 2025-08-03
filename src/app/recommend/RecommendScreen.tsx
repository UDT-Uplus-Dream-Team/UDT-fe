'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SwipeContainer } from '@components/Recommend/SwipeContainer';
import { Button } from '@components/ui/button';
import { ProgressBar } from '@components/Recommend/progressbar';
import { showInteractiveToast } from '@components/common/Toast';
import { postFeedbackContent } from '@lib/apis/recommend/postFeedbackContent';
import { useRecommendStore } from '@store/useRecommendStore';
import { useFetchRecommendations } from '@hooks/recommend/useGetRecommendationContents';
import { useRefreshCuratedContents } from '@hooks/recommend/useGetCuratedContents';
import { FinishScreen } from './FinishScreen';
import { sendAnalyticsEvent } from '@lib/gtag';
import { LoadingScreen } from './LoadingScreen';
import { toast } from 'sonner';
import type {
  SwipeResult,
  SwipeHandle,
  FeedbackType,
} from '@type/recommend/swipe';

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
  const swipeRef = useRef<SwipeHandle>(null);

  // 로컬 UI 상태들
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [resultReady, setResultReady] = useState<boolean>(false);
  const [toastShown, setToastShown] = useState<boolean>(false);
  const [loadingDelayOver, setLoadingDelayOver] = useState(false);
  const [remainingCount, setRemainingCount] = useState<number>(20);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // ── 로딩 지연 상태 관리 ──────────────────────────
  useEffect(() => {
    if (moviePool.length > 0) {
      setLoadingDelayOver(true);
    }
  }, [moviePool.length]);

  // ── 초기 데이터 로드 ────────────────────────────
  useEffect(() => {
    const loadInitialMovies = async () => {
      if (hasInitialized.current || moviePool.length > 0) {
        setLoadingDelayOver(true);
        return;
      }

      hasInitialized.current = true;

      try {
        const [initialMovies] = await Promise.all([
          fetchRecommendations(10),
          new Promise((resolve) => setTimeout(resolve, 2000)),
        ]);

        setMoviePool(initialMovies);
        setLoadingDelayOver(true);
      } catch (error) {
        console.error('초기 콘텐츠 로딩 실패:', error);
        hasInitialized.current = false;
        setTimeout(() => setLoadingDelayOver(true), 2000);
      }
    };

    loadInitialMovies();
  }, []);

  // 현재 영화 정보
  const currentMovie = getCurrentMovie();

  useEffect(() => {
    const loadMoreMovies = async () => {
      if (!shouldLoadMoreContent()) return;

      try {
        const newMovies = await fetchRecommendations(10);
        addMoviesToPool(newMovies);
      } catch (error) {
        console.error('추가 영화 로드 실패:', error);
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
      case 'uninterested':
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
          setIsTransitioning(true);
          try {
            await Promise.all([
              forceRefresh(),
              new Promise((resolve) => setTimeout(resolve, 2000)),
            ]);
            setResultReady(true);
            onComplete();
          } catch (error) {
            console.error('큐레이션 콘텐츠 새로고침 실패:', error);
            setResultReady(true);
            onComplete();
          } finally {
            setIsTransitioning(false);
          }
        },
        onClose: () => {
          resetSwipeCount();
          setToastShown(false);
          setResultReady(false);
          if (59 - useRecommendStore.getState().currentIndex > 20)
            setRemainingCount(20);
          else
            setRemainingCount(59 - useRecommendStore.getState().currentIndex);
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

  // ── 스와이프 처리 ─────────────────────────────
  const handleSwipe = async (result: SwipeResult): Promise<void> => {
    console.log(swipeCount, remainingCount, currentIndex);

    // GA4로 스와이프 이벤트 전송
    sendAnalyticsEvent('swipe_action_in_reels', {
      direction: result.direction,
      feedback: result.feedback,
      content_id: result.item.contentId,
      page: 'recommend_screen',
      swipe_count: swipeCount + 1,
      timestamp: new Date().toISOString(),
    });

    setIsFlipped(false); // 스와이프 시 플립 상태 리셋

    // 즉시 피드백 전송
    await sendFeedbackImmediately(result.item.contentId, result.feedback);

    // 스와이프 카운트 증가 및 인덱스 업데이트
    incrementSwipeCount();
    setCurrentIndex(currentIndex + 1);
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

  useEffect(() => {
    if (shouldShowFinish() && !isTransitioning) {
      const timer = setTimeout(() => {
        toast.dismiss();
      }, 2000); // 2초 후 FinishScreen으로 전환

      return () => clearTimeout(timer);
    }
  }, [shouldShowFinish()]);

  if (isTransitioning) {
    return (
      <LoadingScreen
        message="추천 결과를 준비하고 있어요!"
        submessage="곧 완성된 결과를 보여드릴게요..."
      />
    );
  }

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
          className="text-white bg-primary-400 border-none"
        >
          다시 시도
        </Button>
      </div>
    );
  }

  // ── 콘텐츠 없음 ───────────────────────────────
  if (!currentMovie || moviePool.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="text-white text-xl">콘텐츠를 찾지 못했어요..</div>
        <div className="text-white text-lg">다시 컨텐츠를 뒤지는 중...</div>
      </div>
    );
  }

  // ── 렌더링 ─────────────────────────────────────
  return (
    <div className="flex flex-col w-full h-full items-center justify-center gap-y-5 sm:gap-y-7">
      <div className="flex w-full h-[75%] justify-center items-center">
        <div className="mx-10 w-full h-full">
          <SwipeContainer
            ref={swipeRef}
            items={moviePool}
            onSwipe={handleSwipe}
            enableKeyboard={true}
            isFlipped={isFlipped}
          />
        </div>
      </div>

      {/* 플립 버튼 */}
      {/* <div className="relative z-30 flex flex-col items-center gap-4">
        <Button
          onClick={() => setIsFlipped((f: boolean) => !f)}
          variant="outline"
          className="bg-white/20 border-white/20 text-white px-5 py-2 text-sm hover:bg-white/20 backdrop-blur-sm"
        >
          {isFlipped ? '돌아가기' : '상세보기'}
        </Button>
      </div> */}

      <div className="flex w-full px-10 items-center justify-center">
        <div className="w-full min-w-70 max-w-100">
          <ProgressBar
            value={100 * (swipeCount / remainingCount)}
            backgroundColor="var(--primary-900)"
            indicatorColor="var(--color-logo)"
          />
        </div>
      </div>
    </div>
  );
}
