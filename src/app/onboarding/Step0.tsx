'use client';

import { Ticket } from '@components/Ticket/Ticket';
import { Button } from '@components/ui/button';
import { MockMovies } from './moviedata';

interface StepProps {
  onNext: () => void;
}

export default function Step0({ onNext }: StepProps) {
  const currentMovie = MockMovies[0];

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full px-6 text-white">
      <div className="text-center space-y-4 mb-6">
        <h2 className="text-xl font-semibold leading-relaxed">
          간단한 스와이프 몇번으로 <br />
          취향에 꼭 맞는 컨텐츠를 추천드려요!
        </h2>
      </div>

      <div className="relative w-[80vw] min-w-[280px] max-w-[320px] aspect-[75/135] md:max-w-[400px] sm:aspect-[75/127] max-h-[70vh]">
        <Ticket movie={currentMovie} variant="initial" feedback="neutral" />
      </div>

      <Button
        variant="ghost"
        className="text-white border border-white/30 hover:bg-white/10 mt-5"
        onClick={onNext}
      >
        계속
      </Button>
    </div>
  );
}
