'use client';

import type React from 'react';

import { Home, FolderOpen, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const navItems: NavItem[] = [
  {
    href: '/',
    icon: Home,
    label: '홈',
  },
  {
    href: '/documents',
    icon: FolderOpen,
    label: '문서',
  },
  {
    href: '/profile',
    icon: User,
    label: '프로필',
  },
];

export default function BottomNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-160 mx-auto bg-[var(--primary-900)]/80 backdrop-blur-md border-t border-[var(--primary-700)]/50 px-4 py-3 safe-area-pb">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 min-w-[60px] ${
                isActive
                  ? 'text-white bg-[var(--primary-600)]/30'
                  : 'text-[var(--primary-200)] hover:text-white hover:bg-[var(--primary-700)]/20'
              }`}
            >
              <Icon
                className={`w-6 h-6 mb-1 ${
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
