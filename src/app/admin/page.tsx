'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@components/ui/button';
import AdminDashboard from '@components/admin/AdminDashboard';
import { BatchRequestQueueDashboard } from '@components/admin/BatchRequestQueueDashboard';
import { SmoothExpandableSidebar } from '@components/admin/SmoothExpandableSidebar';
import UserManagement from '@/components/admin/userManagement/UserManagement';
import { BatchResultDashboard } from '@components/admin/BatchResultDashboard';
import Image from 'next/image';

// 탭 종류 정의
type TabType =
  | 'request-queue'
  | 'content-management'
  | 'member-management'
  | 'batch-result';

// 각 탭에 대한 정보를 포함하는 객체
const tabConfig = {
  'content-management': {
    title: '콘텐츠 관리',
    description: '사이트의 콘텐츠를 생성, 수정, 삭제할 수 있습니다',
    component: AdminDashboard,
  },
  'request-queue': {
    title: '배치 대기열',
    description: '서버 내에서 대기 중인 배치 요청들을 확인할 수 있습니다',
    component: BatchRequestQueueDashboard,
  },
  'batch-result': {
    title: '배치 결과',
    description: '서버 내에서 수행된 배치 요청들의 결과를 확인할 수 있습니다',
    component: BatchResultDashboard,
  },
  'member-management': {
    title: '회원 정보 관리',
    description: '회원 정보를 조회하고 관리할 수 있습니다',
    component: UserManagement,
  },
};

// 관리 페이지의 최상단 컴포넌트
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('content-management'); // 현재 활성화된 탭

  const currentTab = tabConfig[activeTab]; // 현재 탭에 관한 정보 포함하는 객체
  const CurrentComponent = currentTab.component; // 현재 탭에 관한 컴포넌트

  return (
    <div className="min-h-screen flex flex-col bg-background transition-all duration-300 ease-out">
      {/* 동적 헤더 */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
        <div className="flex flex-row justify-start items-center">
          <Image
            src="/icons/firefly-adminpage-logo.png"
            alt="logo"
            width={40}
            height={40}
            className="h-full w-auto object-contain mr-4"
          />
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold text-foreground leading-tight">
              {currentTab.title}
            </h1>
            <p className="text-sm text-muted-foreground leading-tight">
              {currentTab.description}
            </p>
          </div>
        </div>

        {/* 로그아웃 버튼 */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {}}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          로그아웃
        </Button>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <div className="relative flex-1">
        {/* 전체 확장 사이드바 */}
        <SmoothExpandableSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        {/* 페이지 콘텐츠 */}
        <main className="ml-16 p-6">
          <div
            key={activeTab}
            className="animate-in fade-in-0 slide-in-from-right-4 duration-300"
          >
            <CurrentComponent />
          </div>
        </main>
      </div>
    </div>
  );
}
