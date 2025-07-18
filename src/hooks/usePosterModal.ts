'use client';

import { useState } from 'react';
import { FeedbackContent } from '@type/profile/RecommendedContent';

export const usePosterModal = () => {
  const [selectedPosterData, setSelectedPosterData] =
    useState<FeedbackContent | null>(null);

  const openModal = (poster: FeedbackContent) => {
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
