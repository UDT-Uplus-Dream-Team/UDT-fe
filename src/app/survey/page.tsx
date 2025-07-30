'use client';

import Step1 from '@components/survey/Step1';
import Step2 from '@components/survey/Step2';
import SurveyComplete from '@components/survey/SurveyComplete';
import { useState } from 'react';
import { postSurvey } from '@lib/apis/survey/postSurvey';
import { usePageStayTracker } from '@hooks/usePageStayTracker';
import { useErrorToastOnce } from '@hooks/useErrorToastOnce';
import { useSurveyStore } from '@store/useSurveyStore';

function SurveyFlow() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const platforms = useSurveyStore((state) => state.platforms);
  const genres = useSurveyStore((state) => state.genres);
  const contentIds = useSurveyStore((state) => state.contentIds);

  const showErrorToast = useErrorToastOnce();

  const handleNext = async () => {
    if (step < 2) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3);
    } else {
      try {
        await postSurvey({
          platforms: platforms,
          genres: genres,
          contentIds: contentIds,
        });
        setStep(3); // 성공 시 완료 페이지로 이동
      } catch {
        showErrorToast('설문조사 제출에 실패했습니다.');
      }
    }
  };

  return (
    <div>
      {step === 1 && <Step1 onNext={handleNext} />}
      {step === 2 && <Step2 onNext={handleNext} />}
      {/* {step === 3 && <Step3 onNext={handleNext} />} */}
      {step === 3 && <SurveyComplete />}
    </div>
  );
}

export default function SurveyPage() {
  // 페이지 머무르는 시간 추적 (설문조사 페이지 추적 / Google Analytics 연동을 위함)
  usePageStayTracker('survey');

  return <SurveyFlow />;
}
