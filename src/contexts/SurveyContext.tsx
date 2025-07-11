'use client';

import { SurveyContextType } from '@type/SurveyContext';
import React, { createContext, useState } from 'react';

export const SurveyContext = createContext<SurveyContextType | null>(null);

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
