'use client';

import { useSurveyContext } from '@hooks/useSurveyContext';
import { CircleOption } from '@components/common/circleOption';
import { PLATFORMS } from '@lib/platforms';
import { Button } from '@components/ui/button';
import { showSimpleToast } from '@components/common/Toast';

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

  const handleComplete = () => {
    if (selectedPlatforms.length === 0) {
      showSimpleToast.error({
        message: '1개 이상 선택해주세요',
        className: 'w-full bg-black/80 shadow-lg text-white',
      });
      return;
    }
    onNext();
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div
        className="flex flex-col items-center px-6 w-full max-w-[500px]"
        style={{ maxHeight: '700px' }}
      >
        {/* 고정 제목 */}
        <h2 className="text-white font-bold text-[20px] text-center mb-10 mt-10">
          추천 받고 싶은 <span className="text-[#9F8EC5]">서비스</span>를
          선택해주세요
        </h2>

        {/* 스크롤 가능한 선택 영역 (항상 크기 고정)*/}
        <div className="overflow-y-auto w-full h-[500px]">
          <div className="grid grid-cols-2 gap-y-6 px-4">
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
        </div>

        {/* 고정 버튼 */}
        <div className="mt-auto pt-10">
          <Button
            onClick={handleComplete}
            className="min-w-[99px] min-h-[41px] bg-white/20 text-white rounded-[80px] px-6 py-2 text-sm font-semibold shadow-md transition-colors hover:bg-white/30 cursor-pointer"
          >
            완료
          </Button>
        </div>
      </div>
    </div>
  );
}
