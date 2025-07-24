import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

export interface ExploreState {
  // 필터 관련 상태
  appliedFilters: string[]; // 실제 적용된 필터 (API 호출에 사용)
  tempFilters: string[]; // 임시 선택된 필터 (BottomSheet 내)
  displayedOptionsInTop: string[]; // 상단에 표시될 옵션들

  // UI 상태
  isBottomSheetOpen: boolean;

  // 필터 옵션
  filterOptions: string[];
  hasUserData: boolean;
}

export interface ExploreActions {
  // 필터 관련 액션
  setAppliedFilters: (filters: string[]) => void;
  setTempFilters: (filters: string[]) => void;
  toggleTempFilter: (filter: string) => void;
  clearTempFilters: () => void;
  applyTempFilters: () => void; // 임시 필터를 실제 필터로 적용

  // 상단 필터 즉시 토글
  toggleAppliedFilter: (filter: string) => void;

  // UI 액션
  openBottomSheet: () => void;
  closeBottomSheet: () => void;

  // 초기화 액션
  initializeFilterOptions: (options: string[], hasUserData: boolean) => void;
  updateDisplayedOptions: () => void;
}

export type ExploreStore = ExploreState & ExploreActions;

export const useExploreStore = create<ExploreStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // 초기 상태
      appliedFilters: [],
      tempFilters: [],
      displayedOptionsInTop: [],
      isBottomSheetOpen: false,
      filterOptions: [],
      hasUserData: false,

      // 필터 관련 액션
      setAppliedFilters: (filters) =>
        set({ appliedFilters: filters }, false, 'setAppliedFilters'),

      setTempFilters: (filters) =>
        set({ tempFilters: filters }, false, 'setTempFilters'),

      toggleTempFilter: (filter) =>
        set(
          (state) => ({
            tempFilters: state.tempFilters.includes(filter)
              ? state.tempFilters.filter((f) => f !== filter)
              : [...state.tempFilters, filter],
          }),
          false,
          'toggleTempFilter',
        ),

      clearTempFilters: () =>
        set({ tempFilters: [] }, false, 'clearTempFilters'),

      // BottomSheet에서 "적용하기" 버튼을 눌렀을 경우 수행할 메소드
      applyTempFilters: () =>
        set(
          (state) => {
            const newAppliedFilters = [...state.tempFilters];
            const displayedOptions =
              newAppliedFilters.length === 0
                ? state.filterOptions
                : newAppliedFilters;

            return {
              appliedFilters: newAppliedFilters,
              displayedOptionsInTop: displayedOptions,
              isBottomSheetOpen: false,
              tempFilters: [],
            };
          },
          false,
          'applyTempFilters',
        ),

      // 상단 필터 즉시 토글
      toggleAppliedFilter: (filter: string) => {
        const { appliedFilters } = get();
        const newFilters = appliedFilters.includes(filter)
          ? appliedFilters.filter((f) => f !== filter)
          : [...appliedFilters, filter];

        set({ appliedFilters: newFilters }, false, 'toggleAppliedFilter');
        get().updateDisplayedOptions();
      },

      // UI 액션
      openBottomSheet: () =>
        set(
          (state) => ({
            isBottomSheetOpen: true,
            tempFilters: [...state.appliedFilters], // 현재 적용된 필터를 임시로 복사
          }),
          false,
          'openBottomSheet',
        ),

      closeBottomSheet: () =>
        set(
          {
            isBottomSheetOpen: false,
            tempFilters: [],
          },
          false,
          'closeBottomSheet',
        ),

      // 초기화 액션
      initializeFilterOptions: (options, hasUserData) =>
        set(
          {
            filterOptions: options,
            hasUserData,
          },
          false,
          'initializeFilterOptions',
        ),

      updateDisplayedOptions: () =>
        set(
          (state) => {
            // appliedFilters가 비어 있으면 기본 옵션들을 보여주고,
            // 그렇지 않으면 appliedFitlers만 보여준다
            const displayedOptions =
              state.appliedFilters.length === 0
                ? state.filterOptions
                : state.appliedFilters;

            return {
              displayedOptionsInTop: displayedOptions,
            };
          },
          false,
          'updateDisplayedOptions',
        ),
    })),
    { name: 'explore-store' },
  ),
);
