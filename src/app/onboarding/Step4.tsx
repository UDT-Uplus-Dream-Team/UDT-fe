'use client';

import { useState } from 'react';
import { Ticket } from '@components/Ticket/Ticket';
import { Button } from '@components/ui/button';
import { MockMovies } from './moviedata';

interface StepProps4 {
  onNext: () => void;
}

export default function Step4({ onNext }: StepProps4) {
  const [flipped, setFlipped] = useState(false);
  const currentMovie = MockMovies[0];

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full px-6 text-white">
      <div className="text-center space-y-4 mb-4 mt-1">
        <h2 className="text-lg md:text-xl font-semibold leading-relaxed">
          추천 받은 컨텐츠의 상세 내용이 궁금하다면?
          <br />
          상세보기 클릭으로 내용 확인 가능합니다
        </h2>
      </div>

      {/* 카드 영역 */}
      <div
        className="relative w-[80svw] min-w-[280px] max-w-[320px] aspect-[75/135] md:max-w-[400px] sm:aspect-[75/127] max-h-[70svh]"
        style={{ perspective: '1000px' }}
        onClick={() => {
          if (!flipped) setFlipped(true);
        }}
      >
        <div
          className="relative w-full h-full"
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 500ms linear',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* 앞면 */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <Ticket movie={currentMovie} variant="initial" feedback="neutral" />
          </div>

          {/* 뒷면 */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              pointerEvents: flipped ? 'auto' : 'none',
              zIndex: flipped ? 30 : 10,
            }}
          >
            <Ticket movie={currentMovie} variant="detail" />
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <Button
        variant="default"
        className="md:mt-5 mt-3 px-8 py-4  text-sm md:text-lg font-semibold rounded-xl bg-white text-black hover:bg-white/90 transition"
        onClick={() => {
          if (flipped) {
            onNext();
          } else {
            setFlipped(true);
          }
        }}
      >
        {flipped ? '계속' : '상세보기 클릭하기!!'}
      </Button>
    </div>
  );
}
