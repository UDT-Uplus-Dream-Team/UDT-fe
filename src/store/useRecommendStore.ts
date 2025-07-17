// src/store/useRecommendStore.ts
import { create } from 'zustand';
import { subscribeWithSelector, devtools } from 'zustand/middleware';
import { TicketComponent } from '@/types/recommend/TicketComponent';

type Phase = 'start' | 'recommend' | 'result';

interface RecommendState {
  // 기존 phase 관리
  phase: Phase;
  setPhase: (phase: Phase) => void;

  // 추천 진행 상황 관리
  moviePool: TicketComponent[];
  currentIndex: number;
  swipeCount: number;

  // 엄선된 컨텐츠 관리
  curatedContents: TicketComponent[];
  isResultLoading: boolean;

  // 액션들
  setMoviePool: (movies: TicketComponent[]) => void;
  addMoviesToPool: (newMovies: TicketComponent[]) => void;
  setCurrentIndex: (index: number) => void;
  incrementSwipeCount: () => void;
  resetSwipeCount: () => void;
  resetRecommendProgress: () => void;
  setCuratedContents: (contents: TicketComponent[]) => void;
  setIsResultLoading: (loading: boolean) => void;

  // 헬퍼 함수들
  getCurrentMovie: () => TicketComponent | undefined;
  getNextMovie: () => TicketComponent | undefined;
  shouldLoadMoreContent: () => boolean;
  shouldShowFinish: () => boolean;
}

export const useRecommendStore = create<RecommendState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // 기존 상태들
      phase: 'start',

      // 새로운 상태들
      moviePool: [],
      currentIndex: 0,
      swipeCount: 0,
      curatedContents: [],
      isResultLoading: false,

      // 기존 액션
      setPhase: (phase: Phase) => set({ phase }),

      // 새로운 액션들
      setMoviePool: (movies: TicketComponent[]) => set({ moviePool: movies }),

      addMoviesToPool: (newMovies: TicketComponent[]) =>
        set((state) => ({
          moviePool: [...state.moviePool, ...newMovies],
        })),

      setCurrentIndex: (index: number) => set({ currentIndex: index }),

      setIsResultLoading: (loading: boolean) =>
        set({ isResultLoading: loading }),

      incrementSwipeCount: () =>
        set((state) => ({ swipeCount: state.swipeCount + 1 })),

      resetSwipeCount: () => set(() => ({ swipeCount: 0 })),

      resetRecommendProgress: () =>
        set({
          moviePool: [],
          currentIndex: 0,
          swipeCount: 0,
        }),

      setCuratedContents: (contents: TicketComponent[]) =>
        set({ curatedContents: contents }),

      // 헬퍼 함수들
      getCurrentMovie: () => {
        const { moviePool, currentIndex } = get();
        return moviePool[currentIndex];
      },

      getNextMovie: () => {
        const { moviePool, currentIndex } = get();
        return moviePool[currentIndex + 1];
      },

      shouldLoadMoreContent: () => {
        const { currentIndex } = get();
        return currentIndex > 0 && currentIndex % 5 === 0;
      },

      shouldShowFinish: () => {
        const { currentIndex } = get();
        return currentIndex >= 5;
      },
    })),
    { name: 'recommend-storage' },
  ),
);
