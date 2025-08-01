'use client';

import { useState, useCallback } from 'react';
import UserDetailModal from '@components/admin/UserDetailModal';
import { User } from '@type/admin/user';
import UserList from '@components/admin/UserList';
import { useInfiniteMockUsers } from '@/hooks/admin/useInfiniteScroll';
export default function UserManagement() {
  const [sortBy, setSortBy] = useState<string>('전체');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const {
    users,
    isLoading,
    hasNextPage,
    loadMoreRef,
    deleteUser,
    deleteFeedback,
  } = useInfiniteMockUsers();

  // 유저 선택 핸들러
  const handleUserSelect = useCallback((user: User) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  }, []);

  // 모달 닫기 핸들러
  const handleCloseModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setSelectedUser(null);
  }, []);

  // 유저 삭제 핸들러
  const handleDeleteUser = useCallback(
    (userId: number) => {
      deleteUser(userId);
      handleCloseModal();
    },
    [deleteUser, handleCloseModal],
  );

  // 피드백 삭제 핸들러
  const handleDeleteFeedback = useCallback(
    (userId: number, feedbackTypes: string[]) => {
      deleteFeedback(userId, feedbackTypes);
    },
    [deleteFeedback],
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            백오피스 관리자 페이지
          </h1>
          <p className="text-gray-600">회원 현황 및 관리</p>
        </div>

        {/* 유저 목록 */}
        <UserList
          users={users}
          onUserSelect={handleUserSelect}
          sortBy={sortBy}
          onSortChange={setSortBy}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          loadMoreRef={loadMoreRef}
        />

        {/* 유저 상세 모달 */}
        {selectedUser && (
          <UserDetailModal
            user={selectedUser}
            isOpen={isDetailModalOpen}
            onClose={handleCloseModal}
            onDelete={handleDeleteUser}
            onDeleteFeedback={handleDeleteFeedback}
          />
        )}
      </div>
    </div>
  );
}
