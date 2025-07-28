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
  const hideBottomNavbarPaths = ['/', '/survey', '/onboarding', '/test'];
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
      {/* 앱 컨테이너 - 고정 너비 */}
      <div className="w-full max-w-160 bg-gradient-to-b from-primary-900 via-purple-900 to-indigo-900 text-white min-h-screen relative overflow-hidden">
        <main
          className={`flex flex-col justify-center h-screen ${
            shouldHideBottomNavbar ? '' : 'pb-15'
          }`}
        >
          {children}
        </main>
        {!shouldHideBottomNavbar && <BottomNavbar />}
      </div>
    </div>
  );
}
