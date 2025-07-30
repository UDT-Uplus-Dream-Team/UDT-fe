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
    <div className="w-full min-h-screen bg-gray-100 flex justify-center overflow-hidden">
      {/* 앱 컨테이너 - flexbox로 구조화 */}
      <div className="w-full h-[100svh] max-w-160 bg-gradient-to-b from-primary-900 via-purple-900 to-indigo-900 text-white flex flex-col relative overflow-hidden">
        {/* 메인 콘텐츠 - 남은 공간 모두 사용 */}
        <main className="flex-1 flex flex-col justify-center overflow-hidden min-h-0">
          {children}
        </main>

        {/* 하단 네비게이션 - 고정 높이 */}
        {!shouldHideBottomNavbar && (
          <div className="h-15 flex-shrink-0">
            <BottomNavbar />
          </div>
        )}
      </div>
    </div>
  );
}
