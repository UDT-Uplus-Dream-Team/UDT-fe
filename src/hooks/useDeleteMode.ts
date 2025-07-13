'use client';

import { useState } from 'react';
import { RecommendedContent } from '@type/mypage/RecommendedContent';
import {
  showInteractiveToast,
  showSimpleToast,
} from '@components/common/Toast';

export const useDeleteMode = (posters: RecommendedContent[]) => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  const handleCardClickInDeleteMode = (poster: RecommendedContent) => {
    setSelectedIds((prev) =>
      prev.includes(poster.contentId)
        ? prev.filter((id) => id !== poster.contentId)
        : [...prev, poster.contentId],
    );
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
      setIsAllSelected(false);
    } else {
      const allIds = posters.map((poster) => poster.contentId);
      setSelectedIds(allIds);
      setIsAllSelected(true);
    }
  };

  const handleDelete = () => {
    if (selectedIds.length === 0) {
      showSimpleToast.error({ message: '삭제할 콘텐츠를 선택해주세요.' });
      return;
    }

    showInteractiveToast.confirm({
      message: '정말 삭제하시겠습니까?',
      confirmText: '삭제',
      cancelText: '취소',
      onConfirm: () => {
        // ✅ 실제 삭제 처리 로직 // 현재는 알람처리 이후 변경
        alert(`삭제할 ID들: ${selectedIds.join(', ')}`);
        setSelectedIds([]);
        setIsDeleteMode(false);
      },
      onCancel: () => {
        // 선택적 처리: 취소할 때 필요한 로직이 있다면 여기에
      },
    });
  };
  const handleCancelDeleteMode = () => {
    setIsDeleteMode(false);
    setIsAllSelected(false);
    setSelectedIds([]);
  };

  return {
    state: {
      isDeleteMode,
      isAllSelected,
      selectedIds,
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
