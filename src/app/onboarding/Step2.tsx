'use client';

import { Button } from '@components/ui/button';
import { Ticket } from '@components/Ticket/Ticket';
import { MockMovies } from './moviedata';
import Lottie from 'lottie-react';
import leftSwipeLottie from '@/assets/Lottie/Swipe Gesture Left.json';

interface StepProps {
  onNext: () => void;
}

export default function Step1({ onNext }: StepProps) {
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
          <h2 className="text-xl md:text-2xl font-semibold leading-relaxed">
            싫어요! 별로인 컨텐츠라면?
          </h2>
          <p className="text-sm md:text-xl text-white/80 animate-pulse">
            왼쪽으로 넘겨 '싫어요' 표시해 주세요
          </p>
        </div>
        {/* 로티 애니메이션 추가 */}
        <Lottie
          animationData={leftSwipeLottie}
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
