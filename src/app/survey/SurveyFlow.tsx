'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Step1 from '@components/survey/Step1';
import Step2 from '@components/survey/Step2';
import SurveyComplete from '@components/survey/SurveyComplete';
import { postSurvey } from '@lib/apis/survey/postSurvey';
import { useErrorToastOnce } from '@hooks/useErrorToastOnce';
import { useSurveyStore } from '@store/useSurveyStore';
import { Button } from '@components/ui/button';

export default function SurveyFlow() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const step = Number(searchParams.get('step'));

  const platforms = useSurveyStore((state) => state.platforms);
  const genres = useSurveyStore((state) => state.genres);
  const contentIds = useSurveyStore((state) => state.contentIds);

  const showErrorToast = useErrorToastOnce();

  const goToStep = (nextStep: number) => {
    router.push(`/survey?step=${nextStep}`);
  };

  const handleNext = async () => {
    if (step < 2) {
      goToStep(step + 1);
    } else {
      try {
        await postSurvey({ platforms, genres, contentIds });
        goToStep(3);
      } catch {
        showErrorToast('설문조사 제출에 실패했습니다.');
      }
    }
  };

  // step이 없으면 시작 화면
  if (!step) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">설문조사 시작!</h1>
        <p className="mb-6">
          간단한 질문을 통해 더 나은 추천을 제공해 드릴게요
        </p>
        <Button onClick={() => goToStep(1)}>시작하기</Button>
      </div>
    );
  }

  return (
    <div>
      {step === 1 && <Step1 onNext={handleNext} />}
      {step === 2 && <Step2 onNext={handleNext} />}
      {step === 3 && <SurveyComplete />}
    </div>
  );
}
