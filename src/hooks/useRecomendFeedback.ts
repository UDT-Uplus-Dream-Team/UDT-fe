import { create } from 'zustand';

// MovieSwipePage 쪽과 동일한 타입
export type FeedbackType = 'liked' | 'unliked' | 'neutral';

interface FeedbackStore {
  feedbacks: FeedbackType[];
  // index번째에 해당 피드백을 기록
  setFeedback: (index: number, fb: FeedbackType) => void;
  // 전체 피드백 초기화
  reset: () => void;
}

export const useFeedbackStore = create<FeedbackStore>((set) => ({
  feedbacks: [],

  setFeedback: (index, fb) =>
    set((state) => {
      const next = [...state.feedbacks];
      next[index] = fb;
      return { feedbacks: next };
    }),

  reset: () =>
    set(() => ({
      feedbacks: [],
    })),
}));
