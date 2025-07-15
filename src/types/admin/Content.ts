export interface Cast {
  castName: string;
  castImageUrl: string;
}

export interface Category {
  categoryType: string;
  genres: string[];
}

export interface Platform {
  platformType: string;
  watchUrl: string;
  isAvailable: boolean;
}

export interface Content {
  contentId: number;
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  openDate: string;
  runningTime: number;
  episode: number;
  rating: string;
  categories: Category[];
  countries: string[];
  directors: string[];
  casts: Cast[];
  platforms: Platform[];
}
