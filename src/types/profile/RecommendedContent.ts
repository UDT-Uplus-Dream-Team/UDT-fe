export interface RecommendedContent {
  contentId: number;
  title: string;
  posterUrl: string;
  openDate?: string;
  runningTime?: number;
  episode?: number;
  categories?: string[];
  directors?: string[];
}

export interface GetRecommendedContentsResponse {
  item: RecommendedContent[];
  nextCursor: string | null;
  hasNext: boolean;
}

export interface RecommendedQueryParams {
  cursor: number | null;
  size: number;
}
