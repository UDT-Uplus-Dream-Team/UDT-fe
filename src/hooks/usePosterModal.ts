'use client';

import { useState } from 'react';
import { RecommendedContent } from '@/types/mypage/RecommendedContent';

export const usePosterModal = () => {
  const [selectedPosterData, setSelectedPosterData] =
    useState<RecommendedContent | null>(null);

  const openModal = (poster: RecommendedContent) => {
    setSelectedPosterData(poster);
  };

  const closeModal = () => {
    setSelectedPosterData(null);
  };

  return {
    state: {
      selectedPosterData,
    },
    actions: {
      openModal,
      closeModal,
    },
  };
};
