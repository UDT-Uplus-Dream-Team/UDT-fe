'use client';

import { SurveyContextType } from '@/types/SurveyContext';
import React, { createContext, useContext, useState } from 'react';

const SurveyContext = createContext<SurveyContextType | null>(null);

export function SurveyProvider({ children }: { children: React.ReactNode }) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [watchedContents, setWatchedContents] = useState<string[]>([]);

  return (
    <SurveyContext.Provider
      value={{
        selectedPlatforms,
        setSelectedPlatforms,
        selectedGenres,
        setSelectedGenres,
        watchedContents,
        setWatchedContents,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
}

export function useSurveyContext() {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurveyContext must be used within a SurveyProvider');
  }
  return context;
}
