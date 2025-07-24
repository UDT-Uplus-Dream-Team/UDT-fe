'use client';

import { useState } from 'react';

export const useDeleteMode = <T>(
  items: T[],
  getId: (item: T) => number | undefined,
) => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  const handleCardClickInDeleteMode = (item: T) => {
    const id = getId(item);
    if (id === undefined) return;

    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    const allIds = items
      .map(getId)
      .filter((id): id is number => id !== undefined);

    setSelectedIds(isAllSelected ? [] : allIds);
    setIsAllSelected(!isAllSelected);
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
      handleCancelDeleteMode,
      setSelectedIds,
    },
  };
};
