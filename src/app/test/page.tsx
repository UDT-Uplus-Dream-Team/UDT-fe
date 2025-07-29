'use client';

import { Ticket } from '@/components/Ticket/Ticket';
import { MockMovies } from '../onboarding/moviedata';
import { Button } from '@/components/ui/button';

export default function Step1() {
  const currentMovie = MockMovies[0];

  return (
    <div className="relative flex items-center justify-center h-full w-full px-6 text-white">
      {/* 카드 (배경처럼) */}
      <div className="relative w-[80vw] min-w-[280px] max-w-[320px] aspect-[75/135] md:max-w-[400px] sm:aspect-[75/127] max-h-[70vh]">
        <Ticket movie={currentMovie} variant="initial" feedback="neutral" />
      </div>

      {/* 검정 투명 오버레이 */}
      <div className="absolute inset-0 bg-black/70 z-20 flex flex-col items-center justify-center text-center px-6">
        <div className="flex flex-col items-center gap-3 mb-6">
          <h2 className="text-xl md:text-2xl font-semibold leading-relaxed">
            한 번 보고 싶은 컨텐츠라면?
          </h2>
          <p className="text-sm md:text-xl text-white/80 animate-pulse">
            👉우측으로 스와이프하여 좋아요 표시할 수 있어요
          </p>
        </div>

        <Button
          variant="ghost"
          className="text-white border border-white/30 hover:bg-white/10"
        >
          계속
        </Button>
      </div>
    </div>
  );
}
