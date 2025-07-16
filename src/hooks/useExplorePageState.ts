import { useExploreStore } from '@store/ExploreStore';
import { useFetchOttFilterOptions } from '@/hooks/explore/useFetchOttFilterOptions';
import { useEffect } from 'react';

// 필터 관련 상태만 구독하는 훅 (각 항목 분리 구독)
export const useExploreFilters = () => {
  const appliedFilters = useExploreStore((s) => s.appliedFilters);
  const displayedOptionsInTop = useExploreStore((s) => s.displayedOptionsInTop);
  const toggleAppliedFilter = useExploreStore((s) => s.toggleAppliedFilter);

  return { appliedFilters, displayedOptionsInTop, toggleAppliedFilter };
};

// 임시 필터 상태만 구독하는 훅
export const useExploreTempFilters = () => {
  const tempFilters = useExploreStore((s) => s.tempFilters);
  const toggleTempFilter = useExploreStore((s) => s.toggleTempFilter);
  const clearTempFilters = useExploreStore((s) => s.clearTempFilters);

  return { tempFilters, toggleTempFilter, clearTempFilters };
};

// UI 상태만 구독하는 훅
export const useExploreUI = () => {
  const isBottomSheetOpen = useExploreStore((s) => s.isBottomSheetOpen);
  const openBottomSheet = useExploreStore((s) => s.openBottomSheet);
  const closeBottomSheet = useExploreStore((s) => s.closeBottomSheet);
  const applyTempFilters = useExploreStore((s) => s.applyTempFilters);

  return {
    isBottomSheetOpen,
    openBottomSheet,
    closeBottomSheet,
    applyTempFilters,
  };
};

// 초기화 관련 훅
export const useExploreInitializer = () => {
  const { filterOptions, hasUserData } = useFetchOttFilterOptions();
  const initializeFilterOptions = useExploreStore(
    (s) => s.initializeFilterOptions,
  );
  const updateDisplayedOptions = useExploreStore(
    (s) => s.updateDisplayedOptions,
  );

  useEffect(() => {
    initializeFilterOptions(filterOptions, hasUserData);
    updateDisplayedOptions();
  }, [
    filterOptions,
    hasUserData,
    initializeFilterOptions,
    updateDisplayedOptions,
  ]);

  return { filterOptions, hasUserData };
};
