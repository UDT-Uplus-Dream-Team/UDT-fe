// 요일별 메시지 배열 (일요일부터 토요일까지)
const WEEKLY_MESSAGES = [
  '일요일엔 일단한번 봐!', // 0: 일요일
  '월요일엔 무기력한 당신에게 즐거움을!', // 1: 월요일
  '화요일엔 화난 당신에게!', // 2: 화요일
  '수요일엔 수사물!', // 3: 수요일
  '목요일엔 목적없이 아무거나!', // 4: 목요일
  '금요일엔 연인과 함께!', // 5: 금요일
  '토요일엔 잠이 부족한 당신에게!', // 6: 토요일
] as const;

// 현재 요일의 인덱스를 반환 (0: 일요일, 1: 월요일, ..., 6: 토요일)
const getCurrentDayOfWeek = () => {
  return new Date().getDay();
};

// 특정 요일의 메시지 반환
const getWeeklyMessage = (dayIndex: number): string => {
  if (dayIndex < 0 || dayIndex > 6) {
    throw new Error('요일 인덱스는 0-6 사이의 값이어야 합니다.');
  }
  return WEEKLY_MESSAGES[dayIndex];
};

// 오늘 요일에 맞는 메시지 반환
export const getTodayRecommendSentence = () => {
  const today = getCurrentDayOfWeek();
  return getWeeklyMessage(today);
};
