'use client';

import { GENRES } from '@lib/genres';
import { CircleOption } from '@components/common/circleOption';
import { Button } from '@components/ui/button';
import { useEffect } from 'react';
import { useErrorToastOnce } from '@hooks/useErrorToastOnce';
import { useSurveyStore } from '@store/useSurveyStore';

type Step2Props = {
  onNext: () => void;
};

export default function Step2({ onNext }: Step2Props) {
  const selectedGenres = useSurveyStore((state) => state.genres);
  const setSelectedGenres = useSurveyStore((state) => state.setGenres);

  const showErrorToast = useErrorToastOnce();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleGenre = (genre: string) => {
    // 3개 선택 상태에서 새로운 장르를 선택하려 할 때 방지
    if (!selectedGenres.includes(genre) && selectedGenres.length >= 3) {
      showErrorToast('선호 장르는 최대 3개까지 선택할 수 있습니다.');
      return;
    }

    const updated = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];

    setSelectedGenres(updated);
  };

  const handleNext = () => {
    if (selectedGenres.length === 0) {
      showErrorToast(
        '선호 장르는 최소 1개 이상 최대 3개 이하 선택해야 합니다.',
      );
      return;
    }

    onNext();
  };

  return (
    <div className="h-[100svh] flex justify-center items-center">
      <div
        className="flex flex-col items-center px-6 w-full max-w-[500px]"
        style={{ maxHeight: '700px' }}
      >
        {/* 고정 제목 */}
        <h2 className="text-white font-bold text-[20px] text-center mb-10">
          좋아하는 <span className="text-[#9F8EC5]">장르</span>를 선택해주세요
        </h2>

        {/* 스크롤 가능한 선택 영역 */}
        <div
          className="overflow-y-auto w-full visible-scroll"
          style={{ maxHeight: '500px' }}
        >
          <div className="grid grid-cols-3 gap-y-4 px-4">
            {GENRES.map(({ label, id }) => (
              <CircleOption
                key={label}
                label={label}
                imageSrc={`/images/genre/${id}.webp`}
                selected={selectedGenres.includes(label)}
                onClick={() => toggleGenre(label)}
                className="m-2"
              />
            ))}
          </div>
        </div>

        {/* 고정 버튼 */}
        <div className="mt-auto pt-3">
          <Button
            onClick={handleNext}
            className="min-w-[99px] min-h-[41px] bg-white/20 text-white rounded-[80px] px-6 py-2 text-sm font-semibold shadow-md transition-colors hover:bg-white/30 cursor-pointer"
          >
            완료
          </Button>
        </div>
      </div>
    </div>
  );
}
