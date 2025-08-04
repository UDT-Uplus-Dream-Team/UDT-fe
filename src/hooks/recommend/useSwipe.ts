'use client';

import { useState, useCallback, useRef } from 'react';
import type {
  SwipeDirection,
  FeedbackType,
  SwipeResult,
} from '@type/recommend/swipe';
import type { TicketComponent } from '@type/recommend/TicketComponent';

interface UseSwipeOptions {
  threshold?: number;
  onSwipe?: (result: SwipeResult) => void;
  animationDuration?: number;
}

export interface SwipeHandle {
  triggerSwipe: (direction: SwipeDirection, feedbackType: FeedbackType) => void;
  isAnimating: boolean;
}

export function useSwipe(
  items: TicketComponent[],
  options: UseSwipeOptions = {},
) {
  const { threshold = 150, onSwipe, animationDuration = 700 } = options;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection | null>(
    null,
  );
  const [feedback, setFeedback] = useState<FeedbackType>('neutral');
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [isSnapback, setIsSnapback] = useState(false);

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const snapbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentItem = items[currentIndex % items.length];
  const nextItem = items[(currentIndex + 1) % items.length];

  const internalHandleSwipe = useCallback(
    async (direction: SwipeDirection, feedbackType: FeedbackType) => {
      if (isAnimating) return;

      setIsAnimating(true);
      setSwipeDirection(direction);
      setFeedback(feedbackType);
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
      setIsSnapback(false); // 스와이프 시 스냅백 해제

      // 스와이프 완료 콜백
      if (onSwipe) {
        onSwipe({
          direction,
          feedback: feedbackType,
          item: currentItem,
        });
      }

      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      // 애니메이션 완료 후 상태 리셋
      animationTimeoutRef.current = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setSwipeDirection(null);
        setFeedback('neutral');
        setIsAnimating(false);
      }, animationDuration);
    },
    [isAnimating, currentItem, onSwipe, animationDuration],
  );

  const updateDragPosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!startPoint || isAnimating) return;

      const dx = clientX - startPoint.x;
      const dy = clientY - startPoint.y;

      setDragOffset({ x: dx, y: dy });

      // 드래그 중 피드백 미리보기
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (absX > absY && absX > 50) {
        setFeedback(dx > 0 ? 'liked' : 'unliked');
      } else if (dy < -50) {
        setFeedback('uninterested');
      } else {
        setFeedback('neutral');
      }
    },
    [startPoint, isAnimating],
  );

  const startDrag = useCallback(
    (x: number, y: number) => {
      if (isAnimating) return;

      setStartPoint({ x, y });
      setIsDragging(true);
      setDragOffset({ x: 0, y: 0 });
      setIsSnapback(false);
    },
    [isAnimating],
  );

  const resetStates = useCallback(() => {
    setStartPoint(null);
    setIsDragging(false);
    setIsSnapback(true);
    setDragOffset({ x: 0, y: 0 });
    setFeedback('neutral');

    if (snapbackTimeoutRef.current) {
      clearTimeout(snapbackTimeoutRef.current);
    }

    snapbackTimeoutRef.current = setTimeout(() => {
      setIsSnapback(false);
    }, 300); // 스냅백 애니메이션 시간과 일치
  }, []);

  const endDrag = useCallback(() => {
    if (!startPoint || isAnimating) return;

    const { x: dx, y: dy } = dragOffset;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (absX > absY && absX > threshold) {
      internalHandleSwipe(
        dx > 0 ? 'right' : 'left',
        dx > 0 ? 'liked' : 'unliked',
      );
    } else if (dy < -threshold) {
      internalHandleSwipe('up', 'uninterested');
    } else {
      // 스냅백 - 즉시 리셋
      resetStates();
    }
  }, [
    startPoint,
    isAnimating,
    dragOffset,
    threshold,
    internalHandleSwipe,
    resetStates,
  ]);

  const getCardTransform = useCallback((): string => {
    // 스와이프 애니메이션 중일 때만 transform 적용
    if (swipeDirection && isAnimating) {
      switch (swipeDirection) {
        case 'left':
          return 'translate3d(-120vw, 0, 0) rotate(-30deg)';
        case 'right':
          return 'translate3d(120vw, 0, 0) rotate(30deg)';
        case 'up':
          return 'translate3d(0, -100vh, 0)';
      }
    }

    if (isDragging) {
      const { x, y } = dragOffset;
      const rotation = Math.max(-30, Math.min(30, x * 0.1));
      const scale = Math.max(0.95, 1 - Math.abs(x) * 0.0001);
      return `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg) scale(${scale})`;
    }

    return 'translate3d(0, 0, 0)';
  }, [swipeDirection, isAnimating, isDragging, dragOffset]);

  // 정리 함수
  const cleanup = useCallback(() => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    if (snapbackTimeoutRef.current) {
      clearTimeout(snapbackTimeoutRef.current);
    }
  }, []);

  // 외부에서 스와이프를 트리거할 수 있는 함수
  const triggerSwipe = useCallback(
    (direction: SwipeDirection, feedbackType: FeedbackType) => {
      internalHandleSwipe(direction, feedbackType);
    },
    [internalHandleSwipe],
  );

  return {
    currentItem,
    nextItem,
    currentIndex,
    feedback,
    isAnimating,
    isDragging,
    swipeDirection,
    isSnapback,
    dragOffset,
    triggerSwipe, // 외부 노출
    updateDragPosition,
    startDrag,
    endDrag,
    getCardTransform,
    cleanup,
  };
}
