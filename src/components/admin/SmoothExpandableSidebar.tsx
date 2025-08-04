'use client';

import * as React from 'react';
import { Clock, FileText, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

type TabType = 'request-queue' | 'content-management' | 'member-management';

interface SmoothExpandableSidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const menuItems = [
  {
    id: 'request-queue' as TabType, // 요청 대기열
    title: '요청 대기열',
    icon: Clock,
  },
  {
    id: 'content-management' as TabType, // 콘텐츠 관리
    title: '콘텐츠 관리',
    icon: FileText,
  },
  {
    id: 'member-management' as TabType, // 회원 정보 관리
    title: '회원 정보 관리',
    icon: Users,
  },
];

// 자연스럽게 x축 방향으로 확장되는 사이드바
export function SmoothExpandableSidebar({
  activeTab,
  onTabChange,
}: SmoothExpandableSidebarProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  // 마우스 올려놨을 때 확장
  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  // 마우스 떠나면 축소
  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  return (
    <div
      className={cn(
        'fixed left-0 top-16 z-40 h-full bg-sidebar border-r border-sidebar-border flex flex-col',
        'transition-all duration-300 ease-out shadow-lg',
        isExpanded ? 'w-64' : 'w-16',
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 메뉴 영역 */}
      <nav className="flex-1 py-2">
        {menuItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              'w-full h-12 flex items-center transition-all duration-200',
              'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              'px-4 group relative',
              activeTab === item.id &&
                'bg-sidebar-accent text-sidebar-accent-foreground',
            )}
            style={{
              transitionDelay: isExpanded ? `${index * 50}ms` : '0ms',
            }}
          >
            {/* 아이콘 */}
            <div className="flex-shrink-0 flex items-center justify-center w-8">
              <item.icon className="size-5" />
            </div>

            {/* 텍스트 - 확장 시에만 표시 */}
            <div
              className={cn(
                'ml-3 transition-all duration-300 ease-out whitespace-nowrap',
                isExpanded
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-4',
              )}
              style={{
                transitionDelay: isExpanded ? `${100 + index * 30}ms` : '0ms',
              }}
            >
              <span className="text-sm font-medium">{item.title}</span>
            </div>

            {/* 활성 상태 표시 바 (선택 된 거 표시) */}
            {activeTab === item.id && (
              <div className="absolute right-0 top-2 bottom-2 w-1 bg-sidebar-primary rounded-l-full" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
