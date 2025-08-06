'use client';

import * as React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@components/ui/button';
import AdminDashboard from '@components/admin/AdminDashboard';
import { RequestQueueDashboard } from '@components/admin/RequestQueueDashboard';
import { SmoothExpandableSidebar } from '@components/admin/SmoothExpandableSidebar';

type TabType = 'request-queue' | 'content-management' | 'member-management';

// 각 탭에 대한 정보를 포함하는 객체
const tabConfig = {
  'request-queue': {
    title: '요청 대기열',
    description: '사용자 요청을 확인하고 처리할 수 있습니다',
    component: RequestQueueDashboard,
  },
  'content-management': {
    title: '콘텐츠 관리',
    description: '사이트의 콘텐츠를 생성, 수정, 삭제할 수 있습니다',
    component: AdminDashboard,
  },
  'member-management': {
    title: '회원 정보 관리',
    description: '회원 정보를 조회하고 관리할 수 있습니다',
    component: AdminDashboard,
  },
};

// 관리 페이지의 최상단 컴포넌트
export default function AdminPage() {
  const [activeTab, setActiveTab] = React.useState<TabType>('request-queue');

  const currentTab = tabConfig[activeTab]; // 현재 탭에 관한 정보 포함하는 객체
  const CurrentComponent = currentTab.component; // 현재 탭에 관한 컴포넌트

  return (
    <div className="min-h-screen flex flex-col bg-background transition-all duration-300 ease-out">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold text-foreground leading-tight">
            {currentTab.title}
          </h1>
          <p className="text-sm text-muted-foreground leading-tight">
            {currentTab.description}
          </p>
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
