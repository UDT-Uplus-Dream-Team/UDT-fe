'use client';

import { useSurveyContext } from '@hooks/useSurveyContext';
import { SurveyPosterCard } from './SurveyPosterCard';
import { Button } from '@components/ui/button';
import { useEffect, useState } from 'react';
import { MOCK_CONTENTS } from './mockContents';
import { Skeleton } from '../common/Skeleton';
import Image from 'next/image';

type Step3Props = {
  onNext: () => void;
};

function getRandomContents(count: number) {
  const shuffled = [...MOCK_CONTENTS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function Step3({ onNext }: Step3Props) {
  const { watchedContents, setWatchedContents } = useSurveyContext();
  const [randomContents] = useState(() => getRandomContents(9));
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (loadedCount === randomContents.length) {
      setIsLoaded(true);
    }
  }, [loadedCount, randomContents.length]);

  const toggleContent = (contentId: number) => {
    const updated = watchedContents.includes(contentId)
      ? watchedContents.filter((id) => id !== contentId)
      : [...watchedContents, contentId];

    setWatchedContents(updated);
  };

  const handleImageLoad = () => {
    setLoadedCount((prev) => prev + 1);
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div
        className="flex flex-col items-center px-6 w-full max-w-[500px]"
        style={{ maxHeight: '700px' }}
      >
        {/* 고정 제목 */}
        <h2 className="text-white font-bold text-[20px] text-center mb-10 mt-10">
          보신 <span className="text-[#9F8EC5]">컨텐츠</span>가 있다면
          선택해주세요!
        </h2>

        {/* 스크롤 가능한 포스터 목록 */}
        <div
          className="overflow-y-auto w-full visible-scroll"
          style={{ maxHeight: '500px' }}
        >
          <div className="grid grid-cols-3 gap-6 px-4">
            {isLoaded
              ? randomContents.map(({ contentId, title, posterUrl }, idx) => (
                  <SurveyPosterCard
                    key={`${contentId}-${idx}`}
                    title={title}
                    image={posterUrl}
                    selected={watchedContents.includes(contentId)}
                    onClick={() => toggleContent(contentId)}
                  />
                ))
              : Array.from({ length: 9 }).map((_, idx) => (
                  <Skeleton key={idx} className="w-[100px] h-[150px]" />
                ))}

            {/* 이미지 preload (invisible로 로드 트리거) */}
            {!isLoaded &&
              randomContents.map(({ posterUrl }, idx) => (
                <Image
                  key={`preload-${idx}`}
                  src={posterUrl}
                  alt=""
                  width={100}
                  height={150}
                  unoptimized
                  onLoad={handleImageLoad}
                  className="invisible absolute w-[1px] h-[1px]"
                />
              ))}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="mt-auto pt-10 flex justify-center gap-6">
          <Button
            onClick={onNext}
            className="min-w-[99px] min-h-[41px] bg-white/20 text-white rounded-[80px] px-6 py-2 text-sm font-semibold shadow-md transition-colors hover:bg-white/30 cursor-pointer"
          >
            건너뛰기
          </Button>
          <Button
            onClick={onNext}
            className="min-w-[99px] min-h-[41px] bg-white/20 text-white rounded-[80px] px-6 py-2 text-sm font-semibold shadow-md transition-colors hover:bg-white/30 cursor-pointer"
          >
            완료
          </Button>
        </div>
      </div>
    </div>
  );
}
