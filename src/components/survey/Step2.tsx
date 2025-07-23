'use client';

import { GENRES } from '@lib/genres';
import { useSurveyContext } from '@hooks/useSurveyContext';
import { CircleOption } from '@components/common/circleOption';
import { Button } from '@components/ui/button';
import { showSimpleToast } from '@components/common/Toast';
import { useEffect } from 'react';

type Step2Props = {
  onNext: () => void;
};

export default function Step2({ onNext }: Step2Props) {
  const { selectedGenres, setSelectedGenres } = useSurveyContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleGenre = (genre: string) => {
    const updated = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];

    setSelectedGenres(updated);
  };

  const handleNext = () => {
    if (selectedGenres.length === 0) {
      showSimpleToast.error({
        message: '선호 장르는 최소 1개 이상 최대 3개 이하 선택해야 합니다.',
        position: 'top-center',
        className: 'w-full bg-black/80 shadow-lg text-white',
      });
      return;
    }

    if (selectedGenres.length > 3) {
      showSimpleToast.error({
        message: '선호 장르는 최대 3개까지 선택할 수 있습니다.',
        position: 'top-center',
        className: 'w-full bg-black/80 shadow-lg text-white',
      });
      return;
    }

    onNext();
  };

  return (
    <div className="h-[calc(100vh-80px)] overflow-y-auto flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center">
        <h2 className="text-white font-bold text-[20px] mb-14 text-center mt-18">
          좋아하는 <span className="text-[#9F8EC5]">장르</span>를 선택해주세요
        </h2>

        <div className="grid grid-cols-3 gap-y-6 w-full mx-auto px-10 mb-15">
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
          onClick={handleNext}
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
