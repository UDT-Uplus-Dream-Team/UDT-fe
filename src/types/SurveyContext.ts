export type SurveyContextType = {
  selectedPlatforms: string[];
  setSelectedPlatforms: (platforms: string[]) => void;
  selectedGenres: string[];
  setSelectedGenres: (genres: string[]) => void;
  watchedContents: number[];
  setWatchedContents: (contents: number[]) => void;
};
