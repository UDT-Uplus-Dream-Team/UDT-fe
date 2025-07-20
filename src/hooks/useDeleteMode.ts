'use client';

import { useState } from 'react';
import { FeedbackContent } from '@/types/profile/FeedbackContent';
import {
  showInteractiveToast,
  showSimpleToast,
} from '@components/common/Toast';

export const useDeleteMode = (posters: FeedbackContent[]) => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedFeedbackIds, setSelectedFeedbackIds] = useState<number[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  const handleCardClickInDeleteMode = (poster: FeedbackContent) => {
    const id = poster.feedbackId;
    if (id === undefined) return;

    setSelectedFeedbackIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    const allIds = posters
      .map((poster) => poster.feedbackId)
      .filter((id): id is number => id !== undefined);

    if (isAllSelected) {
      setSelectedFeedbackIds([]);
      setIsAllSelected(false);
    } else {
      setSelectedFeedbackIds(allIds);
      setIsAllSelected(true);
    }
  };

  const handleDelete = () => {
    if (selectedFeedbackIds.length === 0) {
      showSimpleToast.error({
        message: '삭제할 콘텐츠를 선택해주세요.',
        position: 'top-center',
        className: 'w-full bg-black/80 shadow-lg',
      });
      return;
    }

    showInteractiveToast.confirm({
      message: '정말 삭제하시겠습니까?',
      confirmText: '삭제',
      cancelText: '취소',
      position: 'top-center',
      className: 'w-[360px] bg-white shadow-lg',
      onConfirm: () => {
        // ✅ 실제 삭제 처리 로직 api // 현재는 알람처리 이후 변경
        alert(`삭제할 ID들: ${selectedFeedbackIds.join(', ')}`);
        // TODO: 실제 삭제 API 연동
        // await deleteFeedbacksByIds(selectedFeedbackIds);

        // 상태 초기화
        setSelectedFeedbackIds([]);
        setIsDeleteMode(false);
        setIsAllSelected(false);
      },
    });
  };

  const handleCancelDeleteMode = () => {
    setIsDeleteMode(false);
    setIsAllSelected(false);
    setSelectedFeedbackIds([]);
  };

  return {
    state: {
      isDeleteMode,
      isAllSelected,
      selectedIds: selectedFeedbackIds,
    },
    actions: {
      setIsDeleteMode,
      handleCardClickInDeleteMode,
      handleSelectAll,
      handleDelete,
      handleCancelDeleteMode,
    },
  };
};
