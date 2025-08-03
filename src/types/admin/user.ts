export interface User {
  id: number;
  name: string;
  email: string;
  ProfileImageUrl?: string;
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

export interface GenreFeedback {
  genreType: string; // 예: "ACTION", "DOCUMENTARY"
  likeCount: number;
  dislikeCount: number;
  uninterestedCount: number;
}

export interface UserDetail {
  id: number;
  name: string;
  email: string;
  ProfileImageUrl?: string;
  lastLoginAt: string;
  totalLikeCount: number;
  totalDislikeCount: number;
  totalUninterestedCount: number;
  genres: GenreFeedback[];
}

export interface UserDetailModalProps {
  userId: number;
  isOpen: boolean;
  onClose: () => void;
}

export type adminGenre = {
  label: string;
  id: string;
};
