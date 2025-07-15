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

export interface FeedbackContent {
  contentId: number;
  title: string;
  posterUrl: string;
  openDate?: string;
  runningTime?: number;
  episode?: number;
  categories?: string[];
  directors?: string[];
}

export interface FeedbackQueryParams {
  cursor: number | null;
  size: number;
  feedbackType: 'LIKE' | 'DISLIKE';
  feedbackSortType: 'NEWEST' | 'OLDEST';
}

export interface GetFeedbackContentsResponse {
  contents: FeedbackContent[];
  nextCursor: number | null;
  hasNext: boolean;
}
