'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Ticket } from '@components/Ticket/Ticket';
import { Button } from '@components/ui/button';
import { showInteractiveToast } from '@components/common/Toast';
import { getAvailableContents, fetchMoreContents } from './RecommendContent';
import { postFeedbackContent } from '@lib/apis/recommend/postFeedbackContent';
import { TicketComponent } from '@type/recommend/TicketComponent';

type SwipeDirection = 'left' | 'right' | 'up';
type FeedbackType = 'liked' | 'unliked' | 'neutral';

export interface RecommendProps {
  onComplete: () => void;
}

export function RecommendScreen({ onComplete }: Readonly<RecommendProps>) {
  // ── useRef로 관리되는 데이터들 ──────────────────────────────────────
  const moviesRef = useRef<TicketComponent[]>([]);
  const feedbackRef = useRef<{ contentId: number; feedback: string }[]>([]);
  const swipeCountRef = useRef<number>(0);

  // ── 기존 UI 상태들 (애니메이션 관련은 절대 건드리지 않음) ─────────────
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [nextMovie, setNextMovie] = useState<TicketComponent | null>(null);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection | null>(
    null,
  );
  const [feedback, setFeedback] = useState<FeedbackType>('neutral');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const startPoint = useRef<{ x: number; y: number } | null>(null);
  const [resultReady, setResultReady] = useState<boolean>(false);
  const [swipeCount, setSwipeCount] = useState<number>(0);
  const [toastShown, setToastShown] = useState<boolean>(false);

  // 현재 영화 (useRef에서 안전하게 가져오기)
  const currentMovie: TicketComponent | undefined =
    moviesRef.current[currentIndex];

  // ── 초기 데이터 로드 ───────────────────────────────────────────────
  useEffect(() => {
    const initialMovies: TicketComponent[] = getAvailableContents();
    moviesRef.current = initialMovies;

    // nextMovie 설정
    if (initialMovies.length > 1) {
      setNextMovie(initialMovies[1]);
    }

    setCurrentIndex(0);
    setSwipeCount(0);
    swipeCountRef.current = 0;

    return () => {
      moviesRef.current = [];
      // feedbackRef.current = [];
    };
  }, []);

  // ── 10초마다 새로운 영화 데이터 추가 ──────────────────────────────
  useEffect(() => {
    const interval: NodeJS.Timeout = setInterval(async () => {
      try {
        const newMovies: TicketComponent[] = await fetchMoreContents();
        console.log(`${newMovies.length}개의 새로운 영화가 추가되었습니다.`);

        // useRef 업데이트 (리렌더링 없음)
        moviesRef.current = getAvailableContents();
      } catch (error: unknown) {
        console.error('영화 데이터 추가 실패:', error);
      }
    }, 10000); // 10초마다

    return () => clearInterval(interval);
  }, []);

  // ── 스와이프 처리 (피드백 데이터 useRef에 저장) ─────────────────────
  const handleSwipe = (
    direction: SwipeDirection,
    feedbackType?: FeedbackType,
  ): void => {
    if (isAnimating || isFlipped || !currentMovie) return;

    setIsAnimating(true);
    setSwipeDirection(direction);
    if (feedbackType) setFeedback(feedbackType);
    setIsFlipped(false);

    // 피드백 데이터 저장 (리렌더링 없음)
    if (feedbackType && currentMovie) {
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

      feedbackRef.current.push({
        contentId: currentMovie.contentId,
        feedback: feedbackValue,
      });
    }
    // 스와이프 카운트 증가
    swipeCountRef.current += 1;
    setSwipeCount((prev: number) => prev + 1);

    // 애니메이션 → 인덱스 이동
    setTimeout(() => {
      setSwipeDirection(null);
      setCurrentIndex((prev: number) => prev + 1);
      setFeedback('neutral');
    }, 700);

    // 애니메이션 잠금 해제
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);

    console.log(feedbackRef);
  };

  // ── 다음 카드 갱신 (useRef 데이터 사용) ────────────────────────────
  useEffect(() => {
    if (!isAnimating) {
      const nextIdx: number = currentIndex + 1;
      setNextMovie(moviesRef.current[nextIdx] ?? null);
    }
  }, [isAnimating, currentIndex]);

  // ── 절반 넘으면 한 번만 결과 호출 ───────────────────────────────────
  useEffect(() => {
    const SWIPE_THRESHOLD = 10; // 10번 스와이프하면 결과 호출

    if (swipeCount >= SWIPE_THRESHOLD && !resultReady && !toastShown) {
      setToastShown(true); // 토스트 표시됨으로 설정

      showInteractiveToast.action({
        message: '모든 영화를 확인했습니다!\n추천 결과를 보시겠어요?',
        actionText: '결과 보기',
        duration: Infinity,
        position: 'top-center',
        className: 'bg-gray-500',
        onAction: async () => {
          console.log('수집된 피드백 데이터:', feedbackRef.current);
          try {
            // 피드백 데이터 POST 요청
            const result = await postFeedbackContent(feedbackRef.current);

            if (result.success) {
              console.log('피드백 전송 성공:', result.message);
            } else {
              console.warn('피드백 전송 실패:', result.message);
            }
          } catch (error: unknown) {
            console.error('피드백 전송 중 오류:', error);
          }

          // 피드백 전송 결과와 관계없이 ResultScreen으로 이동
          setResultReady(true);
          onComplete();
        },
        onClose: () => {
          // Toast 닫기 시 count만 초기화 (phase는 그대로)
          console.log('Toast 닫힘 - 카운트만 초기화');
          setSwipeCount(0);
          swipeCountRef.current = 0;
          setResultReady(false);
          setToastShown(false); // 토스트 상태 초기화
          // feedbackRef는 초기화하지 않음 (phase 변경 시에만 초기화)
        },
      });
    }
  }, [swipeCount, resultReady, toastShown, onComplete]);

  // ── 키보드 스와이프 지원 ────────────────────────────────────────────
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

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAnimating, isFlipped]);

  // ── 터치/마우스 시작 & 끝 처리 ────────────────────────────────────
  const onPointerDown = (e: React.PointerEvent): void => {
    if (isAnimating) return;
    startPoint.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e: React.PointerEvent): void => {
    if (!startPoint.current) return;
    const dx: number = e.clientX - startPoint.current.x;
    const dy: number = e.clientY - startPoint.current.y;
    startPoint.current = null;
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
  if (currentIndex >= moviesRef.current.length || !currentMovie) return null;

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="text-lg">
        <p>테스트용 - 총 {moviesRef.current.length}개 영화</p>
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
