'use client';

import { useEffect, useRef } from 'react';
import { sendAnalyticsEvent } from '@lib/gtag';

// 페이지 당 머무르는 시간을 추적하는 custom Hook (Google Analytics 연동을 위함)
export function usePageStayTracker(pageName: string) {
  const enterTimeRef = useRef<number>(Date.now());
  const sendRef = useRef(false); // 이벤트 전송 여부 체크 (SPA에서는 문제 없지만, 브라우저 새로고침 등의 경우 중복 전송 방지를 위함)

  // pageName이 변경될 때마다 시간 초기화
  useEffect(() => {
    enterTimeRef.current = Date.now();
    sendRef.current = false;

    // 페이지를 떠날 때 머무른 시간 추적
    const handlePageLeave = () => {
      if (sendRef.current) return; // 이미 이벤트가 전송되었으면 중복 전송 방지
      sendRef.current = true;
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
