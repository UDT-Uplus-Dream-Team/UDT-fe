'use client';

import { GENRES } from '@/lib/genres';
import { useSurveyStore } from '@/stores/surveyStore';
import { CircleOption } from '@/components/common/circleOption';
import { Button } from '@/components/ui/button';

type Step2Props = {
  onNext: () => void;
};

export default function Step2({ onNext }: Step2Props) {
  const { selectedGenres, setGenres } = useSurveyStore();

  const toggleGenre = (genre: string) => {
    const updated = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];

    setGenres(updated);
  };

  return (
    <div className="flex flex-col items-center min-h-screen pt-17 pb-10">
      <h2 className="text-white font-bold text-[20px] mb-14 text-center">
        좋아하는 <span className="text-[#9F8EC5]">장르</span>를 선택해주세요
      </h2>

      <div className="grid grid-cols-3 gap-y-6 w-full mx-auto px-10 mb-16">
        {GENRES.map(({ label, id }) => (
          <CircleOption
            key={label}
            label={label}
            imageSrc={`/images/genre/${id}.png`}
            selected={selectedGenres.includes(label)}
            onClick={() => toggleGenre(label)}
            className="m-1"
          />
        ))}
      </div>
      <Button
        onClick={onNext}
        className={
          'min-w-[99px] min-h-[41px] bg-white/20 text-white rounded-[80px] px-6 py-2 text-sm font-semibold shadow-md transition-colors hover:bg-white/30 cursor-pointer'
        }
      >
        완료
      </Button>
    </div>
  );
}
