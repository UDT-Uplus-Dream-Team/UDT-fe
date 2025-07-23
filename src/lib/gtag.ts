// 구글 애널리틱스 태그 관리 라이브러리

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// 커스텀 이벤트 전송 함수
export const sendAnalyticsEvent = (
  event: string,
  params?: Record<string, number | string>,
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, params || {});
  }
};
