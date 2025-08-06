import { Suspense } from 'react';
import OnboardingClient from './OnboardingClient';
import { LoadingScreen } from '@components/common/LoadingScreen';

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <LoadingScreen
          message="튜토리얼을 불러오고 있어요!"
          submessage="잠시만 기다려주세요...."
        />
      }
    >
      <OnboardingClient />
    </Suspense>
  );
}
