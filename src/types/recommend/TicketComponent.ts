export interface Category {
  category: string;
  genres: string[];
}

export interface TicketComponent {
  contentId: number;
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  openDate: string;
  runningTime: number;
  episode: number;
  rating: string;
  categories: Category;
  directors: string[];
  platforms: string[];
}
