export interface Cast {
  castId: number;
  castName: string;
  castImageUrl: string;
}

export interface Director {
  directorId: number;
  directorName: string;
  directorImageUrl: string;
}

export interface Category {
  categoryType: string;
  genres: string[];
}

export interface PlatformInfo {
  platformType: string;
  watchUrl: string;
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
  directors: Director[];
  casts: Cast[];
  platforms: PlatformInfo[];
}

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
  directors: Director[];
  casts: Cast[];
  platforms: PlatformInfo[];
}

// 콘텐츠 목록 조회 params 타입
export interface AdminContentListParams {
  cursor: string | null;
  size: number;
  categoryType: string | null;
}

// 콘텐츠 목록 조회용 Content 타입
export interface ContentSummary {
  contentId: number;
  title: string;
  posterUrl: string;
  openDate: string;
  rating: string;
  categories: string[];
  platforms: string[];
}

// 콘텐츠 목록 조회 전체 응답 타입
export interface AdminContentListResponse {
  item: ContentSummary[];
  nextCursor: string | null;
  hasNext: boolean;
}

// 콘텐츠 등록/수정용 타입 (directors와 casts는 ID 배열)
export interface ContentCreateUpdate {
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
  directors: number[];
  casts: number[];
  platforms: PlatformInfo[];
}
