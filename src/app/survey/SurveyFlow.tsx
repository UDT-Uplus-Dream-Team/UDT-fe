'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Step1 from '@components/survey/Step1';
import Step2 from '@components/survey/Step2';
import SurveyComplete from '@components/survey/SurveyComplete';
import { postSurvey } from '@lib/apis/survey/postSurvey';
import { useErrorToastOnce } from '@hooks/useErrorToastOnce';
import { showSimpleToast } from '@components/common/Toast';
import { useSurveyStore } from '@store/useSurveyStore';
import { useEffect } from 'react';
import { Button } from '@components/ui/button';

export default function SurveyFlow() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const stepParam = searchParams.get('step');
  const step = Number(stepParam);

  const platforms = useSurveyStore((state) => state.platforms);
  const genres = useSurveyStore((state) => state.genres);
  const contentIds = useSurveyStore((state) => state.contentIds);

  const showErrorToast = useErrorToastOnce();

  // step 쿼리 없으면 자동으로 ?step=1 붙여줌
  useEffect(() => {
    if (!stepParam) {
      router.replace('/survey?step=1');
    }
  }, [stepParam, router]);

  const goToStep = (nextStep: number) => {
    router.push(`/survey?step=${nextStep}`);
  };

  const handleNext = async () => {
    if (step < 2) {
      goToStep(step + 1);
    } else {
      try {
        await postSurvey({ platforms, genres, contentIds });

        // 성공 토스트 표시
        showSimpleToast.success({
          message: '회원 가입 완료! 튜토리얼로 이동합니다...',
          duration: 3000,
          position: 'top-center',
          className: 'bg-success text-white px-4 py-2 rounded-md mx-auto',
        });

        // 3초 후 온보딩으로 자동 리다이렉트
        setTimeout(() => {
          router.push('/onboarding');
        }, 3000);
      } catch (error) {
        const message =
          error instanceof Error && error.message
            ? error.message
            : '설문조사 제출에 실패했습니다.';
        showErrorToast(message);
      }
    }
  };

  return (
    <div>
      {step === 1 && <Step1 onNext={handleNext} />}
      {step === 2 && <Step2 onNext={handleNext} />}
      {step === 3 && <SurveyComplete />}
      {step > 3 && (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="mb-4 font-bold">잘못된 설문 단계입니다.</p>
          <Button onClick={() => goToStep(1)}>처음부터 시작</Button>
        </div>
      )}
    </div>
  );
}
