'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { User } from '@/types/admin/user';
import { generateMockUsers } from '@/mocks/users';

interface UseInfiniteMockUsersProps {
  initialSize?: number;
}

export function useInfiniteMockUsers({
  initialSize = 20,
}: UseInfiniteMockUsersProps = {}) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // 초기 로딩
  useEffect(() => {
    const initialUsers = generateMockUsers(initialSize, 101);
    setUsers(initialUsers);
    setNextCursor(101 + initialSize);
  }, [initialSize]);

  // 추가 로딩
  const loadMoreUsers = useCallback(() => {
    if (isLoading || !hasNextPage || nextCursor == null) return;

    setIsLoading(true);

    setTimeout(() => {
      const newUsers = generateMockUsers(initialSize, nextCursor);
      setUsers((prev) => [...prev, ...newUsers]);
      setNextCursor(nextCursor + initialSize);

      if (users.length + newUsers.length >= 100) {
        setHasNextPage(false);
      }

      setIsLoading(false);
    }, 800);
  }, [isLoading, hasNextPage, nextCursor, users.length, initialSize]);

  // Intersection Observer
  useEffect(() => {
    if (!hasNextPage || isLoading) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMoreUsers();
      }
    });

    const element = loadMoreRef.current;
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [hasNextPage, isLoading, loadMoreUsers]);

  // 유저 업데이트
  const updateUser = useCallback((userId: number, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.memberId === userId ? { ...user, ...updates } : user,
      ),
    );
  }, []);

  // 유저 삭제
  const deleteUser = useCallback((userId: number) => {
    setUsers((prev) => prev.filter((user) => user.memberId !== userId));
  }, []);

  // 피드백 삭제 (좋아요/싫어요/관심없음)
  const deleteFeedback = useCallback(
    (userId: number, feedbackTypes: string[]) => {
      setUsers((prev) =>
        prev.map((user) => {
          if (user.memberId === userId) {
            const updatedUser = { ...user };
            feedbackTypes.forEach((type) => {
              if (type === 'like') updatedUser.likeCount = 0;
              if (type === 'dislike') updatedUser.dislikeCount = 0;
              if (type === 'uninterested') updatedUser.uninterestedCount = 0;
            });
            return updatedUser;
          }
          return user;
        }),
      );
    },
    [],
  );

  return {
    users,
    isLoading,
    hasNextPage,
    loadMoreRef,
    updateUser,
    deleteUser,
    deleteFeedback,
  };
}
