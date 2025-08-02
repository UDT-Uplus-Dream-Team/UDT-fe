'use client';

import type React from 'react';
import {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useState,
} from 'react';
import { useSwipe } from '@hooks/recommend/useSwipe';
import { Ticket } from '@components/Recommend/Ticket';
import type {
  TicketData,
  SwipeResult,
  SwipeHandle,
} from '@type/recommend/swipe';

interface SwipeContainerProps {
  items: TicketData[];
  onSwipe?: (result: SwipeResult) => void;
  className?: string;
  enableKeyboard?: boolean;
}

export const SwipeContainer = forwardRef<SwipeHandle, SwipeContainerProps>(
  ({ items, onSwipe, className = '', enableKeyboard = true }, ref) => {
    const {
      currentItem,
      nextItem,
      feedback,
      isAnimating,
      isDragging,
      swipeDirection,
      isSnapback,
      triggerSwipe,
      updateDragPosition,
      startDrag,
      endDrag,
      getCardTransform,
      cleanup,
    } = useSwipe(items, { onSwipe });

    // 현재 카드 렌더링 완료 상태 추적
    const [currentCardRendered, setCurrentCardRendered] = useState(false);

    // 현재 카드가 렌더링될 때마다 상태 업데이트
    useEffect(() => {
      setCurrentCardRendered(false);
      const timer = requestAnimationFrame(() => {
        setCurrentCardRendered(true);
      });
      return () => cancelAnimationFrame(timer);
    }, [currentItem, isAnimating]);

    // 부모 컴포넌트에 함수와 상태 노출
    useImperativeHandle(ref, () => ({
      triggerSwipe,
      isAnimating,
    }));

    // 키보드 이벤트 처리
    useEffect(() => {
      if (!enableKeyboard) return;

      const handleKeyPress = (e: KeyboardEvent): void => {
        if (isAnimating) return;

        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            triggerSwipe('left', 'unliked');
            break;
          case 'ArrowRight':
            e.preventDefault();
            triggerSwipe('right', 'liked');
            break;
          case 'ArrowDown':
            e.preventDefault();
            triggerSwipe('up', 'neutral');
            break;
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isAnimating, triggerSwipe, enableKeyboard]);

    // 컴포넌트 언마운트 시 정리
    useEffect(() => {
      return cleanup;
    }, [cleanup]);

    // 포인터 이벤트 핸들러
    const handlePointerDown = useCallback(
      (e: React.PointerEvent): void => {
        if (isAnimating) return;
        startDrag(e.clientX, e.clientY);
      },
      [isAnimating, startDrag],
    );

    const handlePointerMove = useCallback(
      (e: React.PointerEvent): void => {
        if (!isDragging) return;
        updateDragPosition(e.clientX, e.clientY);
      },
      [isDragging, updateDragPosition],
    );

    const handlePointerUp = useCallback((): void => {
      if (!isDragging) return;
      endDrag();
    }, [isDragging, endDrag]);

    // 터치 이벤트 핸들러
    const handleTouchStart = useCallback(
      (e: React.TouchEvent): void => {
        if (isAnimating || e.touches.length !== 1) return;
        e.preventDefault();
        const touch = e.touches[0];
        startDrag(touch.clientX, touch.clientY);
      },
      [isAnimating, startDrag],
    );

    const handleTouchMove = useCallback(
      (e: React.TouchEvent): void => {
        if (!isDragging || e.touches.length !== 1) return;
        e.preventDefault();
        const touch = e.touches[0];
        updateDragPosition(touch.clientX, touch.clientY);
      },
      [isDragging, updateDragPosition],
    );

    const handleTouchEnd = useCallback(
      (e: React.TouchEvent): void => {
        if (!isDragging || e.changedTouches.length !== 1) return;
        e.preventDefault();
        endDrag();
      },
      [isDragging, endDrag],
    );

    // TicketData를 기존 Ticket 컴포넌트 형식으로 변환
    const convertToTicketFormat = (item: TicketData) => ({
      contentId: item.contentId,
      title: item.title,
      description: item.description,
      posterUrl: item.posterUrl,
      backdropUrl: item.backdropUrl,
      openDate: item.openDate,
      runningTime: item.runningTime,
      episode: item.episode,
      rating: item.rating,
      category: item.category,
      genres: item.genres,
      directors: item.directors,
      casts: item.casts,
      platforms: item.platforms,
    });

    // transition 클래스 계산
    const getTransitionClass = () => {
      if (swipeDirection && isAnimating) {
        return 'transition-transform duration-700 ease-out';
      }
      if (isDragging) {
        return '';
      }
      if (isSnapback) {
        return 'transition-all duration-300 ease-in';
      }
      return '';
    };

    return (
      <div
        className={`relative select-none touch-none ${className}`}
        style={{
          touchAction: 'none',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {/* 자리 채우기 티켓 (레이아웃 고정용) */}
        <div className="relative flex w-full h-[70svh] aspect-[75/135] min-w-70 min-h-110 max-w-100 max-h-180 invisible pointer-events-none items-center justify-center">
          <Ticket
            movie={convertToTicketFormat(currentItem)}
            feedback="neutral"
            variant="initial"
          />
        </div>

        {/* 현재 카드 - 직접 div 사용 (SwipeCard 완전 제거) */}
        <div
          className={`absolute inset-0 z-20 flex items-center justify-center ${getTransitionClass()}`}
          style={{
            perspective: '1000px',
            transform: getCardTransform(),
          }}
        >
          <div
            className={`relative w-full h-full flex justify-center items-center opacity-100
           transition-opacity duration-300`}
          >
            <Ticket
              key={`current-${currentItem?.contentId}`}
              movie={convertToTicketFormat(currentItem)}
              feedback={feedback}
              variant="initial"
            />
          </div>
        </div>

        {/* 다음 카드 peek - 현재 카드 렌더링 완료 후에만 표시 */}
        {nextItem && currentCardRendered && (
          <div
            className={`absolute inset-0 z-10 flex items-center justify-center pointer-events-none transition-all ease-out ${
              isAnimating && swipeDirection
                ? 'duration-200 opacity-100 scale-100'
                : isDragging
                  ? 'duration-200 opacity-60 scale-100'
                  : 'duration-200 opacity-50 scale-100'
            }`}
          >
            <Ticket
              key={`next-${nextItem?.contentId}`}
              movie={convertToTicketFormat(nextItem)}
              feedback="neutral"
              variant="initial"
            />
          </div>
        )}
      </div>
    );
  },
);
