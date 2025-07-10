import { create } from 'zustand';

type SurveyState = {
  selectedPlatforms: string[];
  selectedGenres: string[];
  watchedContents: string[];

  setPlatforms: (services: string[]) => void;
  setGenres: (genres: string[]) => void;
  setWatchedContents: (contents: string[]) => void;
  resetSurvey: () => void;
};

export const useSurveyStore = create<SurveyState>((set) => ({
  selectedPlatforms: [],
  selectedGenres: [],
  watchedContents: [],

  setPlatforms: (services) => set({ selectedPlatforms: services }),
  setGenres: (genres) => set({ selectedGenres: genres }),
  setWatchedContents: (contents) => set({ watchedContents: contents }),
  resetSurvey: () =>
    set({ selectedPlatforms: [], selectedGenres: [], watchedContents: [] }),
}));
