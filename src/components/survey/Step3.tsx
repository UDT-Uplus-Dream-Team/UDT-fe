'use client';

import { useSurveyContext } from '@hooks/useSurveyContext';
import { SurveyPosterCard } from './SurveyPosterCard';
import { Button } from '@components/ui/button';
import { useEffect } from 'react';

type Step3Props = {
  onNext: () => void;
};

const MOCK_CONTENTS = [
  { id: 1, title: '귀를 기울이면', image: '/images/poster1.webp' },
  { id: 2, title: '고양이의 보은', image: '/images/poster2.webp' },
  { id: 3, title: '벼랑 위의 포뇨', image: '/images/poster3.webp' },
  { id: 4, title: '귀를 기울이면2', image: '/images/poster1.webp' },
  { id: 5, title: '고양이의 보은2', image: '/images/poster2.webp' },
  { id: 6, title: '벼랑 위의 포뇨2', image: '/images/poster3.webp' },
  { id: 7, title: '귀를 기울이면3', image: '/images/poster1.webp' },
  { id: 8, title: '고양이의 보은3', image: '/images/poster2.webp' },
  { id: 9, title: '벼랑 위의 포뇨3', image: '/images/poster3.webp' },
];

export default function Step3({ onNext }: Step3Props) {
  const { watchedContents, setWatchedContents } = useSurveyContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleContent = (contentId: number) => {
    const updated = watchedContents.includes(contentId)
      ? watchedContents.filter((id) => id !== contentId)
      : [...watchedContents, contentId];

    setWatchedContents(updated);
  };

  return (
    <div className="h-screen overflow-y-auto flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center">
        <h2 className="text-white font-bold text-[20px] mb-14 text-center mt-18">
          보신 <span className="text-[#9F8EC5]">컨텐츠</span>가 있다면
          선택해주세요!
        </h2>

        <div className="grid grid-cols-3 gap-6 px-10 mb-15 w-full">
          {MOCK_CONTENTS.map(({ id, title, image }) => (
            <SurveyPosterCard
              key={id}
              title={title}
              image={image}
              selected={watchedContents.includes(id)}
              onClick={() => toggleContent(id)}
            />
          ))}
        </div>

        <div className="flex justify-center gap-10">
          <Button
            onClick={onNext}
            className={
              'min-w-[99px] min-h-[41px] bg-white/20 text-white rounded-[80px] px-6 py-2 text-sm font-semibold shadow-md transition-colors hover:bg-white/30 cursor-pointer'
            }
          >
            건너뛰기
          </Button>
          <Button
            onClick={onNext}
            className={
              'min-w-[99px] min-h-[41px] bg-white/20 text-white rounded-[80px] px-6 py-2 text-sm font-semibold shadow-md transition-colors hover:bg-white/30 cursor-pointer'
            }
          >
            완료
          </Button>
        </div>
      </div>
    </div>
  );
}
