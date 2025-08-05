'use client';

import { SwipeContainer } from '@components/Recommend/SwipeContainer';
import { Button } from '@components/ui/button';
import { MockMovies } from './moviedata';

interface StepProps {
  onNext: () => void;
}

export default function Step0({ onNext }: StepProps) {
  const movieItems = [MockMovies[0]];

  const handleFlipToggle = () => {};

  return (
    <div className="relative flex items-center justify-center h-full w-full px-6 text-white">
      <div className="flex w-[80%] h-[75%] max-h-170 max-w-100 min-w-70 min-h-110 justify-center items-center">
        <div className="w-full h-full">
          <SwipeContainer
            items={movieItems}
            enableKeyboard={false} // 키보드 비활성화
            isFlipped={false}
            onFlipToggle={handleFlipToggle}
          />
        </div>
      </div>

      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/50 z-20 flex flex-col items-center justify-center text-center px-6">
        <div className="flex flex-col items-center gap-3 mb-6">
          <h2 className="text-lg md:text-xl font-semibold leading-relaxed">
            여러분의 선택을 바탕으로
            <br />
            취향에 꼭 맞는 콘텐츠를 추천드립니다!
          </h2>
        </div>

        <Button
          variant="default"
          className="mt-4 px-8 py-4 text-sm md:text-lg font-semibold rounded-xl bg-white text-black hover:bg-white/90 transition"
          onClick={onNext}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
