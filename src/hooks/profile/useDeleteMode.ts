'use client';

import { useState } from 'react';
import { FeedbackContent } from '@/types/profile/FeedbackContent';

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

    setSelectedFeedbackIds(isAllSelected ? [] : allIds);
    setIsAllSelected(!isAllSelected);
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
      handleCancelDeleteMode,
      setSelectedFeedbackIds,
    },
  };
};
