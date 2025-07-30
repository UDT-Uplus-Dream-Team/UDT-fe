'use client';

import type React from 'react';

import { Bookmark, Search, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const navItems: NavItem[] = [
  {
    href: '/recommend',
    icon: Bookmark,
    label: '추천받기',
  },
  {
    href: '/explore',
    icon: Search,
    label: '찾아보기',
  },
  {
    href: '/profile',
    icon: User,
    label: '마이페이지',
  },
];

export default function BottomNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 h-15 left-0 right-0 z-40 max-w-160 mx-auto bg-[var(--primary-900)]/50 backdrop-blur-md border-t border-[var(--primary-700)]/50 px-4 safe-area-pb">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-w-[60px] ${
                isActive
                  ? 'text-white bg-primary-600/30'
                  : 'text-[var(--primary-200)] hover:text-white hover:bg-[var(--primary-700)]/20'
              }`}
            >
              <Icon
                className={`w-5 h-5 mb-1 ${
                  isActive ? 'text-white' : 'text-[var(--primary-200)]'
                }`}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
