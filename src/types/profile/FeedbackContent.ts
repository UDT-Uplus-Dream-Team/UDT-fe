export interface FeedbackContent {
  feedbackId?: number;
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
  item: FeedbackContent[];
  nextCursor: number | null;
  hasNext: boolean;
}
