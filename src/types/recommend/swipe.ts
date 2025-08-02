export interface TicketData {
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
}

export type SwipeDirection = 'left' | 'right' | 'up';
export type FeedbackType = 'liked' | 'unliked' | 'neutral';

export interface SwipeResult {
  direction: SwipeDirection;
  feedback: FeedbackType;
  item: TicketData;
}

export interface SwipeHandle {
  triggerSwipe: (direction: SwipeDirection, feedbackType: FeedbackType) => void;
  isAnimating: boolean;
}
