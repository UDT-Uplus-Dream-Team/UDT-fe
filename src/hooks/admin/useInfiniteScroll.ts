'use client';

import { User } from '@/types/admin/user';
import { useState, useCallback, useEffect, useRef } from 'react';

//임의 목데이터 훅
interface UseInfiniteScrollProps {
  initialSize?: number;
}

export function useInfiniteScroll({
  initialSize = 20,
}: UseInfiniteScrollProps = {}) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // 모의 데이터 생성 함수
  const generateMockUsers = useCallback(
    (count: number, startId: number): User[] => {
      const names = [
        '김민수',
        '이지은',
        '박서준',
        '최유진',
        '정호석',
        '강소라',
        '윤도현',
        '임나영',
        '송지효',
        '김종국',
      ];
      const domains = ['gmail.com', 'naver.com', 'kakao.com', 'daum.net'];

      return Array.from({ length: count }, (_, index) => {
        const id = startId + index;
        const name = names[index % names.length];
        const domain = domains[index % domains.length];
        const joinDate = new Date(
          2024,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1,
        );

        return {
          memberId: id,
          name: `${name}`,
          email: `${name.toLowerCase()}${id}@${domain}`,
          joinDate: joinDate.toISOString(),
          likeCount: Math.floor(Math.random() * 50),
          dislikeCount: Math.floor(Math.random() * 20),
          uninterestedCount: Math.floor(Math.random() * 10),
          profileImage: `/placeholder.svg?height=40&width=40&query=profile-${id}`,
        };
      });
    },
    [],
  );

  // 초기 데이터 로드
  useEffect(() => {
    const initialUsers = generateMockUsers(initialSize, 101);
    setUsers(initialUsers);
    setNextCursor(101 + initialSize);
  }, [generateMockUsers, initialSize]);

  // 더 많은 데이터 로드
  const loadMoreUsers = useCallback(async () => {
    if (isLoading || !hasNextPage || !nextCursor) return;

    setIsLoading(true);

    setTimeout(() => {
      const newUsers = generateMockUsers(initialSize, nextCursor);
      setUsers((prev) => [...prev, ...newUsers]);
      setNextCursor(nextCursor + initialSize);

      if (users.length + newUsers.length >= 100) {
        setHasNextPage(false);
      }

      setIsLoading(false);
    }, 1000);
  }, [
    isLoading,
    hasNextPage,
    nextCursor,
    users.length,
    generateMockUsers,
    initialSize,
  ]);

  // Intersection Observer 설정
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

  // 유저 업데이트 함수들
  const updateUser = useCallback((userId: number, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.memberId === userId ? { ...user, ...updates } : user,
      ),
    );
  }, []);

  const deleteUser = useCallback((userId: number) => {
    setUsers((prev) => prev.filter((user) => user.memberId !== userId));
  }, []);

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
