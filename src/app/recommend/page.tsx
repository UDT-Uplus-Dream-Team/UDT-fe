'use client';

import React from 'react';
import { StartScreen } from './StartScreen';
import { RecommendScreen } from './RecommendScreen';
import { ResultScreen } from './ResultScreen';
import { useRecommendStore } from '@/store/useRecommendStore';

export default function RecommendationPage() {
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
