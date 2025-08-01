import type React from 'react';
export interface User {
  memberId: number;
  name: string;
  email: string;
  joinDate: string;
  likeCount: number;
  dislikeCount: number;
  uninterestedCount: number;
  surveyCompleted: boolean;
}

export interface CursorPageResponse<T> {
  items: T[];
  hasNext: boolean;
  nextCursor: number | null;
}

export interface UserListProps {
  users: User[];
  onUserSelect: (user: User) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  isLoading: boolean;
  hasNextPage: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
}

export interface UserDetailProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (userId: number) => void;
  onDeleteFeedback: (userId: number, feedbackTypes: string[]) => void;
}
