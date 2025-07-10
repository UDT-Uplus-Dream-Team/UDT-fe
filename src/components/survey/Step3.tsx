'use client';

import { useSurveyStore } from '@/stores/surveyStore';
import { SurveyPosterCard } from './SurveyPosterCard';

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
  const { watchedContents, setWatchedContents } = useSurveyStore();

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

      <button
        className="bg-white text-[#666] px-6 py-2 rounded-full text-sm font-semibold shadow-md"
        onClick={onNext}
      >
        완료
      </button>
    </div>
  );
}
