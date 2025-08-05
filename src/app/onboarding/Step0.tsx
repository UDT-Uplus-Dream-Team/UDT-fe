'use client';

import { Ticket } from '@/components/Recommend/Ticket';
import { Button } from '@components/ui/button';
import { MockMovies } from './moviedata';

interface StepProps {
  onNext: () => void;
}

export default function Step0({ onNext }: StepProps) {
  const currentMovie = MockMovies[0];

  return (
    <div className="relative flex items-center justify-center h-full w-full px-6 text-white">
      {/* 카드 */}
      <div className="relative w-[80svw] min-w-[280px] max-w-[320px] aspect-[75/135] md:max-w-[400px] sm:aspect-[75/127] max-h-[70svh]">
        <Ticket movie={currentMovie} variant="initial" feedback="neutral" />
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
          계속
        </Button>
      </div>
    </div>
  );
}
