'use client';

import { useState } from 'react';
import { SwipeContainer } from '@components/Recommend/SwipeContainer';
import { Button } from '@components/ui/button';
import { MockMovies } from './moviedata';

interface StepProps4 {
  onNext: () => void;
}

export default function Step4({ onNext }: StepProps4) {
  const [isFlipped, setIsFlipped] = useState(false);

  // SwipeContainer에서 사용할 단일 아이템 배열
  const movieItems = [MockMovies[0]];

  // 카드 플립 토글 핸들러
  const handleFlipToggle = (flipped: boolean) => {
    setIsFlipped(flipped);
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full px-6 text-white">
      {/* SwipeContainer 영역 */}
      <div className="flex w-[80%] h-[75%] max-h-170 max-w-100 min-w-70 min-h-110 justify-center items-center">
        <div className="w-full h-full">
          <SwipeContainer
            items={movieItems}
            enableKeyboard={false} // 키보드 비활성화
            isFlipped={isFlipped}
            onFlipToggle={handleFlipToggle}
          />
        </div>
      </div>

      {/* 검정 오버레이 + 설명 텍스트 + 버튼 */}
      <div className="absolute inset-0 bg-black/60 z-30 flex flex-col items-center justify-center text-center px-6">
        <div className="flex flex-col items-center gap-4 mb-6">
          <h2 className="text-lg md:text-xl font-semibold leading-relaxed">
            추천 받은 컨텐츠의 상세 내용이 궁금하다면?
            <br />
            우측 상단 눈 아이콘으로 상세보기가 가능해요!
          </h2>
        </div>

        <Button
          variant="default"
          className="mt-4 px-8 py-4 text-sm md:text-lg font-semibold rounded-xl bg-white text-black hover:bg-white/90 transition"
          onClick={onNext}
        >
          계속
        </Button>
      </div>
    </div>
  );
}
