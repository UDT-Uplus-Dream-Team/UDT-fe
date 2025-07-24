// 콘텐츠 관련한 타입들을 모아놓은 파일

export interface StoredContentPlatform {
  platformType: string;
  watchUrl?: string;
}

export interface StoredContentCast {
  castName: string;
  castImageUrl: string;
}

export interface StoredContentDetail {
  contentId?: number;
  title: string;
  description: string;
  posterUrl?: string;
  backdropUrl: string;
  trailerUrl?: string;
  openDate: string;
  runningTime: number;
  episode?: number;
  rating: string;
  categories: string[];
  genres: string[];
  countries?: string[];
  directors?: string[];
  casts?: StoredContentCast[];
  platforms: StoredContentPlatform[];
}
