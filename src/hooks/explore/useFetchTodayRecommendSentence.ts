import { useState, useEffect } from 'react';
import { getTodayRecommendSentence } from '@utils/getTodayRecommendSentence';

// SSR/Hydration 이슈 해결을 위해 오늘 추천 문구를 미리 가져오는 customHook
export const useFetchTodayRecommendSentence = () => {
  const [todayRecommendSentence, setTodayRecommendSentence] =
    useState('금요일엔 금방 집에 갈 것이다!');

  useEffect(() => {
    setTodayRecommendSentence(getTodayRecommendSentence());
  }, []);

  return todayRecommendSentence;
};
