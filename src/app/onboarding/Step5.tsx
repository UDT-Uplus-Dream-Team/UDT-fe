'use client';

import { useState } from 'react';
import { SwipeContainer } from '@components/Recommend/SwipeContainer';
import { Button } from '@components/ui/button';
import { MockMovies } from './moviedata';
interface StepProps5 {
  onNext: () => void;
}

export default function Step5({ onNext }: StepProps5) {
  const [isFlipped, setIsFlipped] = useState(false);

  // MockMovies를 무한 반복할 수 있도록 확장
  const infiniteMovies = [...MockMovies, ...MockMovies, ...MockMovies]; // 3번 반복

  // 스와이프 핸들러 - 카운트만 증가
  const handleSwipe = () => {
    setIsFlipped(false); // 스와이프 시 카드 뒤집기 해제
  };

  // 카드 플립 토글 핸들러
  const handleFlipToggle = (flipped: boolean) => {
    setIsFlipped(flipped);
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full px-6 py-4 text-white">
      {/* 상단 설명 */}
      <div className="text-center space-y-2 mb-4 mt-4">
        <h2 className="text-lg md:text-xl font-semibold leading-relaxed">
          직접 스와이프를 진행해 볼까요?
        </h2>
        <p className="text-sm text-white/70">
          스와이프 및 상세 보기를 직접 사용해보세요!
        </p>
      </div>

      {/* SwipeContainer 영역 */}
      <div className="flex w-[80%] h-[60%] max-h-170 max-w-100 min-w-70 min-h-110 justify-center items-center">
        <div className="w-full h-full">
          <SwipeContainer
            items={infiniteMovies}
            onSwipe={handleSwipe}
            enableKeyboard={true}
            isFlipped={isFlipped}
            onFlipToggle={handleFlipToggle}
          />
        </div>
      </div>

      {/* 하단 안내 및 버튼 */}
      <div className="text-center space-y-4 mt-4">
        <p className="text-xs text-white/60">
          키보드 방향키(←, →, ↑)로도 조작 가능합니다
        </p>

        <Button
          variant="default"
          className="px-8 py-4 text-sm md:text-lg font-semibold rounded-xl bg-white text-black hover:bg-white/90 transition"
          onClick={onNext}
        >
          계속하기
        </Button>
      </div>
    </div>
  );
}
