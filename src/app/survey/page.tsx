'use client';

import Step1 from '@/components/survey/Step1';
import Step2 from '@/components/survey/Step2';
import Step3 from '@/components/survey/Step3';
import SurveyComplete from '@/components/survey/SurveyComplete';
import { useSurveyStore } from '@/stores/surveyStore';
import { useState } from 'react';

export default function SurveyPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const { selectedPlatforms, selectedGenres, watchedContents } =
    useSurveyStore();

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
    } else {
      const requestBody = {
        platforms: selectedPlatforms,
        genres: selectedGenres,
        contents: watchedContents,
      };
      console.log('설문 조사 제출', JSON.stringify(requestBody, null, 2));
      setStep(4);
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
