import { useContext } from 'react';
import { SurveyContext } from '@store/SurveyContext';

export function useSurveyContext() {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error(
      'useSurveyContext 훅은 SurveyProvider 내부에서만 사용해야 합니다.',
    );
  }
  return context;
}
