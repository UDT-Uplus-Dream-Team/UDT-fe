'use client';

import { useSurveyContext } from '@/app/survey/survey-context';
import { CircleOption } from '../common/circleOption';
import { PLATFORMS } from '@/lib/platforms';
import { Button } from '@/components/ui/button';

type Step1Props = {
  onNext: () => void;
};

export default function Step1({ onNext }: Step1Props) {
  const { selectedPlatforms, setSelectedPlatforms } = useSurveyContext();

  const togglePlatforms = (label: string) => {
    if (selectedPlatforms.includes(label)) {
      setSelectedPlatforms(selectedPlatforms.filter((s) => s !== label));
    } else {
      setSelectedPlatforms([...selectedPlatforms, label]);
    }
  };
  return (
    <div className="flex flex-col items-center min-h-screen pt-17">
      <h2 className="text-white font-bold text-[20px] mb-14 text-center">
        추천 받고 싶은 <span className="text-[#9F8EC5]">서비스</span>를
        선택해주세요
      </h2>

      <div className="grid grid-cols-2 gap-y-6 w-full mx-auto px-10 mb-16">
        {PLATFORMS.map(({ label, id }) => (
          <CircleOption
            key={label}
            label={label}
            imageSrc={`/images/ott/${id}.png`}
            selected={selectedPlatforms.includes(label)}
            onClick={() => togglePlatforms(label)}
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
