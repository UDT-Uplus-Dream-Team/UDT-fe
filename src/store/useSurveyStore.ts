import { PostSurveyRequest } from '@type/survey/Survey';
import { create } from 'zustand';

interface SurveyStore extends PostSurveyRequest {
  setPlatforms: (platforms: string[]) => void;
  setGenres: (genres: string[]) => void;
  setContentIds: (contentIds: number[]) => void;
}

export const useSurveyStore = create<SurveyStore>((set) => ({
  platforms: [],
  genres: [],
  contentIds: [],

  setPlatforms: (platforms) => set({ platforms }),
  setGenres: (genres) => set({ genres }),
  setContentIds: (contentIds) => set({ contentIds }),
}));
