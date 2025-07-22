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

  setMoviePool: (movies: TicketComponent[]) => void;
  addMoviesToPool: (newMovies: TicketComponent[]) => void;
  setCurrentIndex: (index: number) => void;
  incrementSwipeCount: () => void;
  resetSwipeCount: () => void;
  resetRecommendProgress: () => void;

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
        }),

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
        const { totalSwipeCount } = get();
        return totalSwipeCount >= 20; // 5번 스와이프하면 결과 화면으로
      },
    })),
    { name: 'recommend-storage' },
  ),
);
