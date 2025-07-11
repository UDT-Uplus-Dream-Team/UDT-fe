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

  if (isAdmin) {
    return (
      <div className="min-h-screen w-full bg-white text-black overflow-w-hidden">
        {children}
      </div>
    );
  }

  return (
    // 외부 컨테이너 - 큰 화면에서 다른 배경색
    <div className="min-h-screen bg-gray-100 flex justify-center overflow-hidden">
      {/* 앱 컨테이너 - 고정 너비 */}
      <div className="w-full max-w-160 bg-primary-800 text-white min-h-screen relative overflow-hidden">
        <main className="pb-20 min-h-screen overflow-y-auto">{children}</main>
        <BottomNavbar />
      </div>
    </div>
  );
}
