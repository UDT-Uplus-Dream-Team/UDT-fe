'use client';

import BottomNavbar from '@/components/common/bottom-navbar';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  // BottomNavbar를 숨겨야 하는 페이지들
  const hideBottomNavbarPaths = [
    '/',
    '/survey',
    '/onboarding',
    '/test',
    '/profile/feedbacks',
    '/profile/recommend',
  ];
  const shouldHideBottomNavbar = hideBottomNavbarPaths.includes(pathname);

  if (isAdmin) {
    return (
      <div className="min-h-screen w-full bg-white text-black overflow-w-hidden">
        {children}
      </div>
    );
  }

  return (
    // 외부 컨테이너 - 큰 화면에서 다른 배경색
    <div className="w-full h-full bg-gray-100 flex justify-center overflow-hidden overscroll-y-none pointer-events-none">
      {/* 앱 컨테이너 - flexbox로 구조화 */}
      <div className="w-full min-h-[100svh] max-w-160 bg-gradient-to-b from-primary-900 via-purple-900 to-indigo-900 text-white flex flex-col relative pointer-events-auto">
        {/* 메인 콘텐츠 - 남은 공간 모두 사용 */}
        <main className="w-full h-full flex flex-col overflow-y-auto">
          <div className="h-[calc(100%-60px)]">{children}</div>
          {!shouldHideBottomNavbar && <BottomNavbar />}
        </main>
      </div>
    </div>
  );
}
