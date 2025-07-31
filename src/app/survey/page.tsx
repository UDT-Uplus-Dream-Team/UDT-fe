'use client';

import { Suspense } from 'react';
import SurveyFlow from '@app/survey/SurveyFlow';

export default function SurveyPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10">로딩 중...</div>}>
      <SurveyFlow />
    </Suspense>
  );
}
