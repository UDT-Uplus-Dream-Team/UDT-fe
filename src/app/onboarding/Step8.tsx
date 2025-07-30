'use client';

import { Button } from '@components/ui/button';
import { Ticket } from '@components/Ticket/Ticket';
import { MockMovies } from './moviedata';

interface Step8Props {
  onNext: () => void;
}

export default function Step8({ onNext }: Step8Props) {
  const movieList = MockMovies.slice(0, 3);

  return (
    <div className="relative flex items-center justify-center h-full w-full px-6 text-white">
      {/* 카드 배경 */}
      <div className="relative h-[70%] md:h-[80%] w-[80%] min-w-70 min-h-130 flex items-center justify-center mt-10">
        {movieList.map((movie) => (
          <div
            key={movie.contentId}
            className="
        absolute my-4
                  min-w-[280px] min-h-[480px]
                  max-w-[400px] max-h-[680px]  w-[80svw] h-[65svh] md:w-full md:h-full
                
      "
          >
            <Ticket movie={movie} variant="result" feedback="neutral" />
          </div>
        ))}
      </div>

      {/* 검정 오버레이 + 텍스트 + 버튼 */}
      <div className="absolute inset-0 bg-black/60 z-20 flex flex-col items-center justify-center text-center px-6">
        <div className="flex flex-col items-center gap-4 mb-6">
          <h2 className="text-lg md:text-xl font-semibold leading-relaxed">
            언제든지 마이페이지에서 <br />
            직접 고른 좋아요, 싫어요 컨텐츠와 <br />
            저장한 컨텐츠 내역을 확인 할 수 있어요
          </h2>
        </div>

        <Button
          variant="default"
          className="mt-4 px-8 py-4 text-sm md:text-lg font-semibold rounded-xl bg-white text-black hover:bg-white/90 transition"
          onClick={onNext}
        >
          반딧불 시작하기
        </Button>
      </div>
    </div>
  );
}
