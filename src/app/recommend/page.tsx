'use client';

import React from 'react';
import { StartScreen } from './StartScreen';
import { RecommendScreen } from './RecommendScreen';
import { ResultScreen } from './ResultScreen';
import { useRecommendStore } from '@store/useRecommendStore';
import { usePageStayTracker } from '@hooks/usePageStayTracker';

export default function RecommendationPage() {
  // 페이지 머무르는 시간 추적 (릴스 페이지 추적 / Google Analytics 연동을 위함)
  usePageStayTracker('recommend_reels');

  const { phase, setPhase } = useRecommendStore();

  return (
    <>
      {phase === 'start' && (
        <StartScreen onStart={() => setPhase('recommend')} />
      )}
      {phase === 'recommend' && (
        <RecommendScreen onComplete={() => setPhase('result')} />
      )}
      {phase === 'result' && <ResultScreen />}
    </>
  );
}
