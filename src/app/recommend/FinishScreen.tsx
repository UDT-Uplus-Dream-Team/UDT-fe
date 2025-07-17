'use client';

import { Button } from '@components/ui/button';
import { CheckCircle, RotateCcw, Eye } from 'lucide-react';
import React from 'react';
import { useRecommendStore } from '@store/useRecommendStore';

export const FinishScreen: React.FC = () => {
  const { setPhase } = useRecommendStore();

  const handleViewResults = () => {
    setPhase('result');
  };

  const handleStartAgain = () => {
    setPhase('start');
  };

  return (
    <div className="min-h-full flex items-center justify-center relative overflow-hidden">
      {/* Animated stars background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Success icon */}
        <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mb-8 shadow-lg">
          <CheckCircle className="w-10 h-10 text-purple-900" />
        </div>

        {/* Main heading */}
        <h1 className="text-2xl font-bold text-white mb-4 leading-relaxed">
          추천이 완료되었습니다!
        </h1>

        {/* Subtitle */}
        <p className="text-purple-200 text-base mb-12 leading-relaxed max-w-sm">
          당신만을 위한 맞춤 콘텐츠를 준비했어요.
          <br />
          지금 바로 확인해보세요!
        </p>

        {/* Action buttons */}
        <div className="space-y-4 w-full max-w-xs">
          <Button
            onClick={handleViewResults}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-full text-base font-medium shadow-lg transition-all duration-200 hover:shadow-xl"
          >
            <Eye className="w-5 h-5 mr-2" />
            추천 결과 보러가기
          </Button>

          <Button
            onClick={handleStartAgain}
            variant="outline"
            className="w-full border-2 border-purple-400 text-purple-200 hover:bg-purple-800 hover:text-white py-4 rounded-full text-base font-medium bg-transparent transition-all duration-200"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            다시 시작하기
          </Button>
        </div>

        {/* Bottom text */}
        <p className="text-purple-300 text-sm mt-8 opacity-80">
          더 나은 추천을 위해 피드백을 남겨주세요
        </p>
      </div>
    </div>
  );
};
