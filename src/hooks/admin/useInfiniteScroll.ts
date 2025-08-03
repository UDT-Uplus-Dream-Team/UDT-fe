'use client';

import { useState, useRef } from 'react';
import { User } from '@/types/admin/user';
import { generateMockUsers } from '@/mocks/users';

export function useInfiniteMockUsers(keyword: string) {
  const [allUsers] = useState<User[]>(generateMockUsers());
  const [isLoading] = useState(false);
  const [hasNextPage] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const normalizedKeyword = keyword.trim().toLowerCase();

  const users = normalizedKeyword
    ? allUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(normalizedKeyword) ||
          user.email.toLowerCase().includes(normalizedKeyword),
      )
    : allUsers;

  return {
    users,
    isLoading,
    hasNextPage,
    loadMoreRef,
  };
}
