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
import { Button } from '@components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import type { SwipeResult, SwipeHandle } from '@type/recommend/swipe';
import type { TicketComponent } from '@type/recommend/TicketComponent';

interface SwipeContainerProps {
  items: TicketComponent[];
  onSwipe?: (result: SwipeResult) => void;
  className?: string;
  enableKeyboard?: boolean;
  isFlipped?: boolean;
  onFlipToggle?: (flipped: boolean) => void;
}

export const SwipeContainer = forwardRef<SwipeHandle, SwipeContainerProps>(
  (
    {
      items,
      onSwipe,
      className = '',
      enableKeyboard = true,
      isFlipped = false,
      onFlipToggle,
    },
    ref,
  ) => {
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

    const handleFlipToggle = useCallback(() => {
      if (onFlipToggle) {
        onFlipToggle(!isFlipped);
      }
    }, [isFlipped, onFlipToggle]);

    // 키보드 이벤트 처리
    useEffect(() => {
      if (!enableKeyboard || isFlipped) return; // isFlipped일 때 키보드 이벤트 비활성화

      const handleKeyPress = (e: KeyboardEvent): void => {
        if (isAnimating || e.repeat) {
          e.preventDefault();
          return;
        }
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            triggerSwipe('left', 'unliked');
            break;
          case 'ArrowRight':
            e.preventDefault();
            triggerSwipe('right', 'liked');
            break;
          case 'ArrowUp':
            e.preventDefault();
            triggerSwipe('up', 'uninterested'); // neutral -> uninterested로 변경
            break;
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isAnimating, triggerSwipe, enableKeyboard, isFlipped]); // isFlipped 의존성 추가

    // 컴포넌트 언마운트 시 정리
    useEffect(() => {
      return cleanup;
    }, [cleanup]);

    // 포인터 이벤트 핸들러
    const handlePointerDown = useCallback(
      (e: React.PointerEvent): void => {
        if (isAnimating || isFlipped) return; // isFlipped 체크 추가
        startDrag(e.clientX, e.clientY);
      },
      [isAnimating, startDrag, isFlipped], // isFlipped 의존성 추가
    );

    // const handlePointerMove = useCallback(
    //   (e: React.PointerEvent): void => {
    //     if (!isDragging || isFlipped) return; // isFlipped 체크 추가
    //     updateDragPosition(e.clientX, e.clientY);
    //   },
    //   [isDragging, updateDragPosition, isFlipped], // isFlipped 의존성 추가
    // );

    const handlePointerUp = useCallback((): void => {
      if (!isDragging || isFlipped) return; // isFlipped 체크 추가
      endDrag();
    }, [isDragging, endDrag, isFlipped]); // isFlipped 의존성 추가

    // 터치 이벤트 핸들러
    const handleTouchStart = useCallback(
      (e: React.TouchEvent): void => {
        if (isAnimating || e.touches.length !== 1 || isFlipped) return; // isFlipped 체크 추가
        const touch = e.touches[0];
        startDrag(touch.clientX, touch.clientY);
      },
      [isAnimating, startDrag, isFlipped], // isFlipped 의존성 추가
    );

    const handleTouchMove = useCallback(
      (e: React.TouchEvent): void => {
        if (!isDragging || e.touches.length !== 1 || isFlipped) return; // isFlipped 체크 추가
        const touch = e.touches[0];
        updateDragPosition(touch.clientX, touch.clientY);
      },
      [isDragging, updateDragPosition, isFlipped], // isFlipped 의존성 추가
    );

    const handleTouchEnd = useCallback(
      (e: React.TouchEvent): void => {
        if (!isDragging || e.changedTouches.length !== 1 || isFlipped) return; // isFlipped 체크 추가
        if (e.cancelable) {
          e.preventDefault();
        }
        endDrag();
      },
      [isDragging, endDrag, isFlipped], // isFlipped 의존성 추가
    );

    // transition 클래스 계산
    const getTransitionClass = () => {
      if (swipeDirection && isAnimating) {
        return 'transition-all duration-700 ease-out';
      }
      if (isDragging) {
        return '';
      }
      if (isSnapback) {
        return 'transition-all duration-300 ease-in';
      }
      return 'transition-opacity duration-700';
    };

    const getCurrentCardOpacity = () => {
      if (swipeDirection && isAnimating) {
        // 스와이프 마무리 시 opacity를 0으로 변경
        return 'opacity-30';
      }
      return 'opacity-100';
    };

    useEffect(() => {
      if (!isDragging) return;

      // 전역 이벤트 리스너 추가 (드래그 중에만)
      const handleGlobalPointerMove = (e: PointerEvent) => {
        if (!isDragging || isFlipped) return;
        updateDragPosition(e.clientX, e.clientY);
      };

      const handleGlobalPointerUp = () => {
        if (!isDragging || isFlipped) return;
        endDrag();
      };

      // 전역 이벤트 리스너 등록
      document.addEventListener('pointermove', handleGlobalPointerMove);
      document.addEventListener('pointerup', handleGlobalPointerUp);
      document.addEventListener('pointercancel', handleGlobalPointerUp);

      // 정리 함수
      return () => {
        document.removeEventListener('pointermove', handleGlobalPointerMove);
        document.removeEventListener('pointerup', handleGlobalPointerUp);
        document.removeEventListener('pointercancel', handleGlobalPointerUp);
      };
    }, [isDragging, updateDragPosition, endDrag, isFlipped]);

    return (
      <div
        className={`relative select-none h-full w-full ${
          isFlipped ? 'touch-action-auto' : 'touch-action-none'
        } ${className}`}
        style={{
          touchAction: isFlipped ? 'auto' : 'none',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
        }}
        onPointerDown={handlePointerDown}
        onPointerCancel={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {/* 자리 채우기 티켓 (레이아웃 고정용) */}
        <div className="relative flex w-full min-w-70 min-h-110 max-w-100 max-h-180 invisible pointer-events-none items-center justify-center">
          <Ticket movie={currentItem} feedback="neutral" variant="initial" />
        </div>

        {/* 현재 카드 */}
        <div
          className={`absolute inset-0 z-20 flex items-center justify-center ${getTransitionClass()} ${getCurrentCardOpacity()}`}
          style={{
            perspective: '1000px',
            transform: getCardTransform(),
          }}
        >
          <div
            className={`relative w-full h-full flex justify-center items-center opacity-100
           transition-opacity duration-300`}
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
                  key={`current-${currentItem?.contentId}`}
                  movie={currentItem}
                  feedback={feedback}
                  variant="initial"
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
                  key={`current-detail-${currentItem?.contentId}`}
                  movie={currentItem}
                  variant="detail"
                />
              </div>
            </div>
            {onFlipToggle && (
              <div className="absolute -top-2 -right-2 z-50">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleFlipToggle}
                  className="w-10 h-10 bg-white hover:bg-gray-50 border border-gray-200 shadow-lg"
                >
                  {isFlipped ? (
                    <EyeOff className="w-4 h-4 text-black" />
                  ) : (
                    <Eye className="w-4 h-4 text-black" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 다음 카드 peek - 현재 카드 렌더링 완료 후에만 표시 */}
        {nextItem && currentCardRendered && (
          <div
            className={`absolute inset-0 z-10 flex items-center justify-center pointer-events-none transition-all ease-out ${
              isAnimating && swipeDirection
                ? 'duration-200 opacity-30 scale-100'
                : isDragging
                  ? 'duration-200 opacity-60 scale-100'
                  : 'duration-200 opacity-0 scale-100'
            }`}
          >
            <Ticket
              key={`next-${nextItem?.contentId}`}
              movie={nextItem}
              feedback="neutral"
              variant="initial"
            />
          </div>
        )}
      </div>
    );
  },
);
