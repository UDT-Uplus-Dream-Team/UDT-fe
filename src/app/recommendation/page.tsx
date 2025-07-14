'use client';

import React, { useState } from 'react';
import { StartScreen } from './StartScreen';
import { RecommendScreen } from './RecommendScreen';
import { ResultScreen } from './ResultScreen';

type Phase = 'start' | 'recommend' | 'result';

export default function RecommendationPage() {
  const [phase, setPhase] = useState<Phase>('start');

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
