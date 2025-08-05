export interface User {
  id: number;
  name: string;
  email: string;
  userRole: string; // 'ADMIN' | 'USER'
  profileImageUrl?: string;
  lastLoginAt: string;
  totalLikeCount: number;
  totalDislikeCount: number;
  totalUninterestedCount: number;
}

export interface CursorPageResponse<T> {
  item: T[];
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
  profileImageUrl?: string;
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
