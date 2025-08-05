'use client';

import { Button } from '@components/ui/button';
import { Ticket } from '@/components/Recommend/Ticket';
import { MockMovies } from './moviedata';
import Lottie from 'lottie-react';
import upSwipeLottie from '@/assets/Lottie/Swipe Gesture Up.json';

interface StepProps3 {
  onNext: () => void;
}

export default function Step3({ onNext }: StepProps3) {
  const currentMovie = MockMovies[0];

  return (
    <div className="relative flex items-center justify-center h-full w-full px-6 text-white">
      {/* 카드 */}
      <div className="relative w-[80svw] min-w-[280px] max-w-[320px] aspect-[75/135] md:max-w-[400px] sm:aspect-[75/127] max-h-[70svh]">
        <Ticket movie={currentMovie} variant="initial" feedback="neutral" />
      </div>

      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/50 z-20 flex flex-col h-full items-center justify-center text-center px-6">
        <div className="flex flex-col items-center gap-3 mb-6">
          <h2 className="text-xl md:text-2xl font-semibold leading-relaxed">
            관심없어...딱히 잘 모르겠다?
          </h2>
          <p className="text-sm md:text-xl text-white/80 animate-pulse">
            위로 쭉쭉 넘겨서 관심없음 처리해 주세요
          </p>
          <p className="mt-1 text-xs md:text-sm text-white/50">
            (키보드 방향키는 <span className="font-semibold">↑</span>를
            눌러주세요)
          </p>
        </div>
        {/* 로티 애니메이션 추가 */}
        <Lottie
          animationData={upSwipeLottie}
          loop
          autoplay
          className="w-[300px] h-[200px]"
        />

        <Button
          variant="default"
          className="mt-8 px-8 py-4  text-sm md:text-lg font-semibold rounded-xl bg-white text-black hover:bg-white/90 transition"
          onClick={onNext}
        >
          계속
        </Button>
      </div>
    </div>
  );
}
