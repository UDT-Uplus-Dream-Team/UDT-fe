'use client';

import { createContext, useState } from 'react';
import { ExplorePageContextType } from '@type/ExplorePageContextType';
import { useFetchOttFilterOptions } from '@/hooks/useFetchOttFilterOptions';

export const ExploreFilterContext = createContext<
  ExplorePageContextType | undefined
>(undefined); // 컨텍스트 생성

// "탐색" 페이지에서 사용할 컨텍스트 제공자 컴포넌트
export const ExportFilterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const { filterOptions, hasUserData } = useFetchOttFilterOptions();

  const toggleOption = (label: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedOptions((prev) =>
        prev.includes(label) ? prev : [...prev, label],
      );
    } else {
      setSelectedOptions((prev) => prev.filter((option) => option !== label));
    }
  };

  const clearSelectedOptions = () => {
    setSelectedOptions([]);
  };

  const value: ExplorePageContextType = {
    filterOptions,
    selectedOptions,
    toggleOption,
    clearSelectedOptions,
    hasUserData,
  };

  return (
    <ExploreFilterContext.Provider value={value}>
      {children}
    </ExploreFilterContext.Provider>
  );
};
