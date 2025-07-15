export interface RecommendedContent {
  contentId: number;
  title: string;
  posterUrl: string;
  rating: string;
  countries: string[];
  platforms: string[];
  categories: {
    category: string;
    genres: string[];
  }[];
}
