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
  isToastShown: boolean;

  savedContentIds: boolean[];

  // ResultScreen 상태들 추가
  resultScreenState: {
    rerollUsed: boolean[]; // [false, false, false] - 각 위치별 리롤 사용 여부
    isFlipped: boolean[]; // [false, false, false] - 각 위치별 플립 상태
    currentIndex: number; // 1 (캐러셀 현재 인덱스)
    contentIndices: number[]; // [0, 1, 2] - 각 위치에 표시될 콘텐츠 인덱스
    savedContentIds: boolean[]; // 6개 콘텐츠 저장 여부 (기존 savedContentIds와 별도)
  };

  setMoviePool: (movies: TicketComponent[]) => void;
  addMoviesToPool: (newMovies: TicketComponent[]) => void;
  setCurrentIndex: (index: number) => void;
  incrementSwipeCount: () => void;
  resetSwipeCount: () => void;
  setToastShown: (shown: boolean) => void;
  resetRecommendProgress: () => void;

  addSavedCuratedContent: (index: number) => void;
  removeSavedCuratedContent: (index: number) => void;
  isSavedCuratedContent: (index: number) => boolean;
  initializeSavedContentIds: (length: number) => void;

  // ResultScreen 상태 관리 액션들
  setResultRerollUsed: (index: number, used: boolean) => void;
  setResultIsFlipped: (index: number, flipped: boolean) => void;
  setResultCurrentIndex: (index: number) => void;
  setResultContentIndex: (position: number, contentIndex: number) => void;
  setResultSavedContent: (contentIndex: number, saved: boolean) => void;
  initializeResultSavedContents: (length: number) => void;
  isResultContentSaved: (contentIndex: number) => boolean;

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
      isToastShown: false,

      // ResultScreen 상태 초기값
      resultScreenState: {
        rerollUsed: [false, false, false],
        isFlipped: [false, false, false],
        currentIndex: 1,
        contentIndices: [0, 1, 2], // 기본적으로 0,1,2번 콘텐츠 표시
        savedContentIds: [], // 6개 콘텐츠 저장 상태
      },

      setPhase: (phase: Phase) => set({ phase }),

      setMoviePool: (movies: TicketComponent[]) => set({ moviePool: movies }),

      addMoviesToPool: (newMovies: TicketComponent[]) =>
        set((state) => ({
          moviePool: [...state.moviePool, ...newMovies],
        })),

      setCurrentIndex: (index: number) => set({ currentIndex: index }),

      setToastShown: (shown: boolean) => set({ isToastShown: shown }),

      incrementSwipeCount: () =>
        set((state) => ({
          swipeCount: state.swipeCount + 1,
          currentIndex: state.currentIndex + 1,
          totalSwipeCount: state.totalSwipeCount + 1,
        })),

      resetSwipeCount: () => set({ swipeCount: 0 }),

      resetRecommendProgress: () => {
        set({
          moviePool: [],
          currentIndex: 0,
          swipeCount: 0,
          totalSwipeCount: 0,
          savedContentIds: [],
          isToastShown: false,
          // ResultScreen 상태도 함께 초기화
          resultScreenState: {
            rerollUsed: [false, false, false],
            isFlipped: [false, false, false],
            currentIndex: 1,
            contentIndices: [0, 1, 2],
            savedContentIds: [],
          },
        });
      },

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

      // ── ResultScreen 상태 관리 액션들 ──────────────────────
      setResultRerollUsed: (index: number, used: boolean) => {
        set((state) => {
          const newRerollUsed = [...state.resultScreenState.rerollUsed];
          newRerollUsed[index] = used;
          const newState = {
            resultScreenState: {
              ...state.resultScreenState,
              rerollUsed: newRerollUsed,
            },
          };
          return newState;
        });
      },

      setResultIsFlipped: (index: number, flipped: boolean) => {
        set((state) => {
          const newIsFlipped = [...state.resultScreenState.isFlipped];
          newIsFlipped[index] = flipped;
          return {
            resultScreenState: {
              ...state.resultScreenState,
              isFlipped: newIsFlipped,
            },
          };
        });
      },

      setResultCurrentIndex: (index: number) => {
        set((state) => ({
          resultScreenState: {
            ...state.resultScreenState,
            currentIndex: index,
          },
        }));
      },

      setResultContentIndex: (position: number, contentIndex: number) => {
        set((state) => {
          const newContentIndices = [...state.resultScreenState.contentIndices];
          newContentIndices[position] = contentIndex;
          return {
            resultScreenState: {
              ...state.resultScreenState,
              contentIndices: newContentIndices,
            },
          };
        });
      },

      setResultSavedContent: (contentIndex: number, saved: boolean) => {
        set((state) => {
          const newSavedContentIds = [
            ...state.resultScreenState.savedContentIds,
          ];
          newSavedContentIds[contentIndex] = saved;
          return {
            resultScreenState: {
              ...state.resultScreenState,
              savedContentIds: newSavedContentIds,
            },
          };
        });
      },

      initializeResultSavedContents: (length: number) => {
        set((state) => ({
          resultScreenState: {
            ...state.resultScreenState,
            savedContentIds: new Array(length).fill(false),
          },
        }));
      },

      isResultContentSaved: (contentIndex: number) => {
        const { resultScreenState } = get();
        return resultScreenState.savedContentIds[contentIndex] || false;
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
        return currentIndex > 0 && currentIndex < 59 && currentIndex % 10 === 9;
      },

      shouldShowFinish: () => {
        const { totalSwipeCount } = get();
        return totalSwipeCount >= 60;
      },
    })),
    { name: 'recommend-storage' },
  ),
);
