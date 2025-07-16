'use client';

import { Button } from '@components/ui/button';
import { Ticket } from '@components/Ticket/Ticket';
import { MockMovies } from './moviedata';

interface StepProps {
  onNext: () => void;
}

export default function Step1({ onNext }: StepProps) {
  const currentMovie = MockMovies[0];

  return (
    <div className="relative flex items-center justify-center min-h-screen px-6 bg-gradient-to-b from-[#0b0c32] via-[#4b3381] to-[#a96fd1] text-white">
      {/* 카드 (배경처럼) */}
      <div className="relative z-10 w-full max-w-[320px] aspect-[75/135]">
        <Ticket movie={currentMovie} variant="initial" feedback="neutral" />
      </div>

      {/* 검정 투명 오버레이 */}
      <div className="absolute inset-0 bg-black/70 z-20 flex flex-col items-center justify-center text-center px-6">
        <div className="flex flex-col items-center gap-3 mb-6">
          <h2 className="text-xl md:text-2xl font-semibold leading-relaxed">
            별로인 컨텐츠라면?
          </h2>
          <p className="text-sm md:text-xl text-white/80 animate-pulse">
            👈좌측으로 스와이프하여 싫어요 표시할 수 있어요
          </p>
        </div>

        <Button
          variant="ghost"
          className="text-white border border-white/30 hover:bg-white/10"
          onClick={onNext}
        >
          계속
        </Button>
      </div>
    </div>
  );
}
