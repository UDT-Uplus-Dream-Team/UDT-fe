export interface Cast {
  castName: string;
  castImageUrl: string;
}

export interface Category {
  categoryType: string;
  genres: string[];
}

export interface Platform {
  platformType: string;
  watchUrl: string;
  // 삭제 예정
  isAvailable: boolean;
}

export interface Content {
  contentId: number;
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  openDate: string;
  runningTime: number;
  episode: number;
  rating: string;
  categories: Category[];
  countries: string[];
  directors: string[];
  casts: Cast[];
  platforms: Platform[];
}

// 콘텐츠 목록 조회 params 타입
export interface AdminContentListParams {
  cursor?: number;
  size?: number;
}

// 콘텐츠 목록 조회용 Content 타입
export interface ContentSummary {
  contentId: number;
  title: string;
  posterUrl: string;
  openDate: string;
  rating: string;
}

// 콘텐츠 목록 조회 전체 응답 타입
export interface AdminContentListResponse {
  item: ContentSummary[];
  nextCursor: string | null;
  hasNext: boolean;
}

// id 제외 콘텐츠 타입
export interface ContentWithoutId {
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  openDate: string;
  runningTime: number;
  episode: number;
  rating: string;
  categories: Category[];
  countries: string[];
  directors: string[];
  casts: Cast[];
  platforms: Platform[];
}
