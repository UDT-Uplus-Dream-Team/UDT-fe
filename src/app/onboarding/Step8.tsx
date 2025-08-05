'use client';

import { Button } from '@components/ui/button';
import { HelpCircle } from 'lucide-react';

interface Step8Props {
  onNext: () => void;
}

export default function Step8({ onNext }: Step8Props) {
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full px-6 text-white text-center">
      <div className="flex flex-col items-center gap-6 mb-8">
        <h2 className="text-xl md:text-2xl font-semibold leading-relaxed">
          튜토리얼이 완료되었어요!
        </h2>

        <div className="text-base md:text-lg text-white/90 leading-relaxed">
          <p>튜토리얼을 다시 보고 싶다면?</p>

          <p className="text-sm md:text-base text-white/70">
            우측 상단의 <HelpCircle className="inline w-4 h-4 mx-1" />{' '}
            <strong>버튼</strong>을 클릭하세요
          </p>
        </div>
      </div>

      <Button
        variant="default"
        className="px-8 py-4 text-base md:text-lg font-semibold rounded-xl bg-white text-black hover:bg-white/90 transition-all duration-200"
        onClick={onNext}
      >
        반딧불 시작하기
      </Button>
    </div>
  );
}
