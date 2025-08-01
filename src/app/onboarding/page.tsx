import { Suspense } from 'react';
import OnboardingClient from './OnboardingClient';

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={<div>데이터를 불러오고 있어요, 잠시만 기다려주세요.</div>}
    >
      <OnboardingClient />
    </Suspense>
  );
}
