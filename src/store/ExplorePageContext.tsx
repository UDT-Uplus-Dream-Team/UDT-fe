'use client';

import { createContext, useCallback, useMemo, useState } from 'react';
import { ExplorePageContextType } from '@type/explore/Explore';
import { useFetchOttFilterOptions } from '@hooks/useFetchOttFilterOptions';

export const ExplorePageContext = createContext<
  ExplorePageContextType | undefined
>(undefined); // 컨텍스트 생성

// "탐색" 페이지에서 사용할 컨텍스트 제공자 컴포넌트
export const ExplorePageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]); // 선택된 옵션들 (현재 표시된 옵션들과는 별개의 내용)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [tempSelectedOptions, setTempSelectedOptions] = useState<string[]>([]); // BottomSheet가 열릴 때 임시로 선택된 옵션들을 저장하는 상태

  const { filterOptions, hasUserData } = useFetchOttFilterOptions();

  // 현재 UI에 표시될 모든 옵션들 (기본 옵션 + 선택된 옵션들, 화면 상단에 표시될 친구들)
  const displayedOptionsInTop = useMemo(() => {
    const allOptions = new Set<string>();

    // 1. 기본 필터 옵션들 추가 (항상 표시되어야 하는 옵션들)
    filterOptions.forEach((option) => {
      allOptions.add(option);
    });

    // 2. 선택된 옵션들 중 filterOptions에 없는 것들만 추가
    selectedOptions.forEach((option) => {
      // filterOptions에 이미 있는 옵션은 추가하지 않음 (중복 방지)
      if (!filterOptions.includes(option)) {
        allOptions.add(option);
      }
    });

    return Array.from(allOptions);
  }, [filterOptions, selectedOptions]);

  //BottomSheet 열기 (현재 선택된 옵션들을 temp에 복사)
  const openBottomSheet = useCallback(() => {
    setTempSelectedOptions(selectedOptions);
    setIsBottomSheetOpen(true);
  }, [selectedOptions]);

  // BottomSheet 닫기 (변경사항 취소)
  const closeBottomSheet = useCallback(() => {
    setTempSelectedOptions([]); // 임시 상태 초기화
    setIsBottomSheetOpen(false);
  }, []);

  // BottomSheet 닫기 (변경사항 적용)
  const confirmBottomSheet = useCallback(() => {
    setSelectedOptions([...tempSelectedOptions]); // 임시 상태를 실제 상태로 적용
    setTempSelectedOptions([]); // 임시 상태 초기화
    setIsBottomSheetOpen(false);
  }, [tempSelectedOptions]);

  // 필터 옵션 토글
  const toggleOption = useCallback(
    (label: string, isSelected: boolean) => {
      if (isBottomSheetOpen) {
        // BottomSheet가 열려있을 때는 "임시" 상태 업데이트
        if (isSelected) {
          setTempSelectedOptions((prev) =>
            prev.includes(label) ? prev : [...prev, label],
          );
        } else {
          setTempSelectedOptions((prev) =>
            prev.filter((option) => option !== label),
          );
        }
      } else {
        // BottomSheet가 닫혀있을 때는 실제 상태 "즉시" 업데이트
        if (isSelected) {
          setSelectedOptions((prev) =>
            prev.includes(label) ? prev : [...prev, label],
          );
        } else {
          setSelectedOptions((prev) =>
            prev.filter((option) => option !== label),
          );
        }
      }
    },
    [isBottomSheetOpen],
  );

  // 선택된 옵션들 초기화
  const clearSelectedOptions = () => {
    setTempSelectedOptions([]);
  };

  // 현재 표시해야 할 선택된 옵션들 (BottomSheet 상태에 따라 다름)
  const currentSelectedOptions = isBottomSheetOpen
    ? tempSelectedOptions
    : selectedOptions;

  const value: ExplorePageContextType = {
    filterOptions,
    toggleOption,
    clearSelectedOptions,
    displayedOptionsInTop, // UI에 표시될 모든 옵션들 (화면 상단에 나타날 놈들)
    currentSelectedOptions, // 현재 선택된 옵션들 (BottomSheet 상태에 따라 "선택된" 옵션 관련 분기 처리를 위해 필요)
    hasUserData,
    isBottomSheetOpen,
    openBottomSheet,
    closeBottomSheet,
    confirmBottomSheet,
  };

  return (
    <ExplorePageContext.Provider value={value}>
      {children}
    </ExplorePageContext.Provider>
  );
};
