import { create } from 'zustand';
import { subscribeWithSelector, devtools } from 'zustand/middleware';
import { TicketComponent } from '@/types/recommend/TicketComponent';

type Phase = 'start' | 'recommend' | 'result';

interface RecommendState {
  phase: Phase;
  setPhase: (phase: Phase) => void;

  moviePool: TicketComponent[];
  currentIndex: number;
  swipeCount: number;
  totalSwipeCount: number;

  savedContentIds: boolean[];

  setMoviePool: (movies: TicketComponent[]) => void;
  addMoviesToPool: (newMovies: TicketComponent[]) => void;
  setCurrentIndex: (index: number) => void;
  incrementSwipeCount: () => void;
  resetSwipeCount: () => void;
  resetRecommendProgress: () => void;

  addSavedCuratedContent: (index: number) => void;
  removeSavedCuratedContent: (index: number) => void;
  isSavedCuratedContent: (index: number) => boolean;
  initializeSavedContentIds: (length: number) => void;

  getCurrentMovie: () => TicketComponent | undefined;
  getNextMovie: () => TicketComponent | undefined;
  shouldLoadMoreContent: () => boolean;
  shouldShowFinish: () => boolean;
}

export const useRecommendStore = create<RecommendState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      phase: 'start',
      moviePool: [],
      currentIndex: 0,
      swipeCount: 0,
      totalSwipeCount: 0,
      savedContentIds: [],

      setPhase: (phase: Phase) => set({ phase }),

      setMoviePool: (movies: TicketComponent[]) => set({ moviePool: movies }),

      addMoviesToPool: (newMovies: TicketComponent[]) =>
        set((state) => {
          // const existingIds = new Set(state.moviePool.map((m) => m.contentId));
          // const uniqueNewMovies = newMovies.filter(
          //   (m) => !existingIds.has(m.contentId),
          // );

          // return {
          //   moviePool: [...state.moviePool, ...uniqueNewMovies],
          // };
          return { moviePool: [...state.moviePool, ...newMovies] };
        }),

      setCurrentIndex: (index: number) => set({ currentIndex: index }),

      incrementSwipeCount: () =>
        set((state) => ({
          swipeCount: state.swipeCount + 1,
          currentIndex: state.currentIndex + 1,
          totalSwipeCount: state.totalSwipeCount + 1,
        })),

      resetSwipeCount: () => set({ swipeCount: 0 }),

      resetRecommendProgress: () =>
        set({
          moviePool: [],
          currentIndex: 0,
          swipeCount: 0,
          totalSwipeCount: 0,
          savedContentIds: [],
        }),

      addSavedCuratedContent: (index: number) => {
        set((state) => {
          const newSavedContentIds = [...state.savedContentIds];
          newSavedContentIds[index] = true;
          return { savedContentIds: newSavedContentIds };
        });
      },

      removeSavedCuratedContent: (index: number) => {
        set((state) => {
          const newSavedContentIds = [...state.savedContentIds];
          newSavedContentIds[index] = false;
          return { savedContentIds: newSavedContentIds };
        });
      },

      isSavedCuratedContent: (index: number) => {
        const { savedContentIds } = get();
        return savedContentIds[index] || false;
      },

      initializeSavedContentIds: (length: number) => {
        set({ savedContentIds: new Array(length).fill(false) });
      },

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
        return currentIndex > 0 && currentIndex % 10 === 1;
      },

      shouldShowFinish: () => {
        const { totalSwipeCount } = get();
        return totalSwipeCount >= 60; // 5번 스와이프하면 결과 화면으로
      },
    })),
    { name: 'recommend-storage' },
  ),
);
