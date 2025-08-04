import { TicketComponent } from './TicketComponent';

export type SwipeDirection = 'left' | 'right' | 'up';
export type FeedbackType = 'liked' | 'unliked' | 'uninterested' | 'neutral';

export interface SwipeResult {
  direction: SwipeDirection;
  feedback: FeedbackType;
  item: TicketComponent;
}

export interface SwipeHandle {
  triggerSwipe: (direction: SwipeDirection, feedbackType: FeedbackType) => void;
  isAnimating: boolean;
}
