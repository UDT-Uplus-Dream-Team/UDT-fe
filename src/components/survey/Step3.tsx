'use client';

import { useSurveyContext } from '@/app/survey/survey-context';
import { SurveyPosterCard } from './SurveyPosterCard';
import { Button } from '@/components/ui/button';

type Step3Props = {
  onNext: () => void;
};

const MOCK_CONTENTS = [
  { title: '귀를 기울이면', image: '/images/poster1.webp' },
  { title: '고양이의 보은', image: '/images/poster2.webp' },
  { title: '벼랑 위의 포뇨', image: '/images/poster3.webp' },
  { title: '귀를 기울이면2', image: '/images/poster1.webp' },
  { title: '고양이의 보은2', image: '/images/poster2.webp' },
  { title: '벼랑 위의 포뇨2', image: '/images/poster3.webp' },
  { title: '귀를 기울이면3', image: '/images/poster1.webp' },
  { title: '고양이의 보은3', image: '/images/poster2.webp' },
  { title: '벼랑 위의 포뇨3', image: '/images/poster3.webp' },
];

export default function Step3({ onNext }: Step3Props) {
  const { watchedContents, setWatchedContents } = useSurveyContext();

  const toggleContent = (title: string) => {
    const updated = watchedContents.includes(title)
      ? watchedContents.filter((t) => t !== title)
      : [...watchedContents, title];

    setWatchedContents(updated);
  };

  return (
    <div className="flex flex-col items-center min-h-screen pt-17 pb-10">
      <h2 className="text-white font-bold text-[20px] mb-14 text-center">
        보신 <span className="text-[#9F8EC5]">컨텐츠</span>가 있다면
        선택해주세요!
      </h2>

      <div className="grid grid-cols-3 gap-6 px-10 mb-16 w-full">
        {MOCK_CONTENTS.map(({ title, image }) => (
          <SurveyPosterCard
            key={title}
            title={title}
            image={image}
            selected={watchedContents.includes(title)}
            onClick={() => toggleContent(title)}
          />
        ))}
      </div>
      <div className="flex gap-10">
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
  );
}
