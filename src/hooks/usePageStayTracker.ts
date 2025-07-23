'use client';

import { useEffect, useRef } from 'react';
import { sendAnalyticsEvent } from '@lib/gtag';

// 페이지 당 머무르는 시간을 추적하는 custom Hook (Google Analytics 연동을 위함)
export function usePageStayTracker(pageName: string) {
  const enterTimeRef = useRef<number>(Date.now());

  // pageName이 변경될 때마다 시간 초기화
  useEffect(() => {
    enterTimeRef.current = Date.now();

    const handlePageLeave = () => {
      const leaveTime = Date.now();
      const staySec = Math.floor((leaveTime - enterTimeRef.current) / 1000);

      sendAnalyticsEvent('page_stay_time', {
        page: pageName,
        stay_sec: staySec,
      });
    };

    window.addEventListener('beforeunload', handlePageLeave);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      handlePageLeave();
      window.removeEventListener('beforeunload', handlePageLeave);
    };
  }, [pageName]);
}
