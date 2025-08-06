export interface TicketComponent {
  contentId: number;
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  openDate: string;
  runningTime: number;
  episode: string;
  rating: string;
  category: string;
  genres: string[];
  directors: string[];
  casts: string[];
  platforms: string[];
  watchUrls: string[];
}

export const getMovieCategory = (movie: TicketComponent): string => {
  return movie.category;
};

export const getMovieGenres = (movie: TicketComponent): string[] => {
  return movie.genres;
};
