'use client';

import { Suspense } from 'react';
import { LoadingScreen } from '@components/common/LoadingScreen';
import SurveyFlow from '@app/survey/SurveyFlow';

export default function SurveyPage() {
  return (
    <Suspense
      fallback={
        <LoadingScreen
          message="회원님의 취향 파악을 준비하는 중이에요!"
          submessage="잠시만 기다려주세요...."
        />
      }
    >
      <SurveyFlow />
    </Suspense>
  );
}
