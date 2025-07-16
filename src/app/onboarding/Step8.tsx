'use client';

import RecommendationCard from '@components/profile/RecommendationCard';
import { recommendData } from '@app/profile/profileData';
import { ArrowRight } from 'lucide-react';
import { Button } from '@components/ui/button';

interface Step8Props {
  onNext: () => void;
}

export default function Step8({ onNext }: Step8Props) {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-[#0b0c32] via-[#4b3381] to-[#a96fd1] text-white px-4 pt-12">
      {/* 안내 텍스트 */}
      <div className="text-center mb-6">
        <p className="text-base font-semibold leading-relaxed whitespace-pre-line">
          마이페이지에서{'\n'}
          저장한 추천 컨텐츠와 좋아요 싫어요 컨텐츠들을{'\n'}
          다시 확인할 수 있어요!
        </p>
        <ArrowRight className="w-6 h-6 text-white rotate-[45deg] animate-bounce mx-auto mt-2" />
      </div>

      {/* 카드 영역 */}
      <div className="flex flex-col gap-6 items-center w-full max-w-[550px] max-h-[580px]">
        {recommendData.map((card, index) => (
          <RecommendationCard key={index} {...card} disabled />
        ))}
      </div>

      {/* 이동 버튼 */}
      <Button
        variant="ghost"
        className="text-white border border-white/30 hover:bg-white/10 mt-12"
        onClick={onNext}
      >
        추천 받으러 가기
      </Button>
    </div>
  );
}
