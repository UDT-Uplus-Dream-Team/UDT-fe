'use client';

import { useState } from 'react';
import { StartScreen } from './onBordingStart';
import Step0 from './Step0';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import Step6 from './Step6';
import Step7 from './Step7';
import { useRouter } from 'next/navigation';
import Step8 from './Step8';
import { usePageStayTracker } from '@hooks/usePageStayTracker';
import { ProgressDots } from '@components/common/ProgressDots';

export default function OnboardingPage() {
  // 페이지 머무르는 시간 추적 (온보딩 페이지 추적 / Google Analytics 연동을 위함)
  usePageStayTracker('onboarding');

  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);

  const router = useRouter();

  const handleStart = () => {
    setStarted(true);
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleComplete = () => {
    // isNewUser 쿠키 제거 (만료 시간을 과거로 설정)
    document.cookie =
      'X-New-User=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    // 추천 페이지로 이동
    router.push('/recommend');
  };

  if (!started) return <StartScreen onStart={handleStart} />;

  const steps = [
    <Step0 onNext={handleNext} key={0} />, // Step0: 설명 + 카드
    <Step1 onNext={handleNext} key={1} />, // Step1: 오른쪽 스와이프 설명
    <Step2 onNext={handleNext} key={2} />, // Step2: 왼쪽 스와이프 설명
    <Step3 onNext={handleNext} key={3} />, // Step3: 관심없음 설명
    <Step4 onNext={handleNext} key={4} />, // Step4: 상세보기 카드 보여주기
    <Step5 onNext={handleNext} key={5} />, // Step5: 실제 좋아요/싫어요 2회 시도 + 자동 전환
    <Step6 onNext={handleNext} key={6} />, // Step6: 확인 토스트 반환
    <Step7 onNext={handleNext} key={7} />, // Step7: 결과 창
    <Step8 onNext={handleComplete} key={7} />, // Step8: 마이페이지 확인
  ];

  return (
    <div className="relative w-full h-full flex flex-col items-center">
      {/* 진행 바 상단에 고정 */}
      <div className="w-full max-w-[640px] px-6 pt-6">
        <ProgressDots currentStep={step} totalSteps={steps.length} />
      </div>

      {/* 현재 스텝 컴포넌트 */}
      <div className="flex-1 w-full">{steps[step]}</div>
    </div>
  );
}
