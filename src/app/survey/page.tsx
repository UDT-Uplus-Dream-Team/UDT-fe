'use client';

import Step1 from '@components/survey/Step1';
import Step2 from '@components/survey/Step2';
import Step3 from '@components/survey/Step3';
import SurveyComplete from '@components/survey/SurveyComplete';
import { useState } from 'react';
import { SurveyProvider } from '@store/SurveyContext';
import { useSurveyContext } from '@hooks/useSurveyContext';
import { postSurvey } from '@lib/apis/survey/postSurvey';
import { showSimpleToast } from '@components/common/Toast';

function SurveyFlow() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const { selectedPlatforms, selectedGenres, watchedContents } =
    useSurveyContext();

  const handleNext = async () => {
    if (step < 3) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
    } else {
      try {
        await postSurvey({
          platforms: selectedPlatforms,
          genres: selectedGenres,
          contentIds: watchedContents,
        });
        setStep(4); // 성공 시 완료 페이지로 이동
      } catch {
        showSimpleToast.error({
          message: '설문조사 제출에 실패했습니다.',
        });
      }
    }
  };

  return (
    <div>
      {step === 1 && <Step1 onNext={handleNext} />}
      {step === 2 && <Step2 onNext={handleNext} />}
      {step === 3 && <Step3 onNext={handleNext} />}
      {step === 4 && <SurveyComplete />}
    </div>
  );
}

export default function SurveyPage() {
  return (
    <SurveyProvider>
      <SurveyFlow />
    </SurveyProvider>
  );
}
