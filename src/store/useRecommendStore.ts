// src/stores/useRecommendStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Phase = 'start' | 'recommend' | 'result';

interface RecommendState {
  phase: Phase;
  setPhase: (phase: Phase) => void;
}

export const useRecommendStore = create<RecommendState>()(
  persist(
    (set) => ({
      phase: 'start',
      setPhase: (phase: Phase) => set({ phase }),
    }),
    {
      name: 'recommend-phase-storage',
    },
  ),
);
