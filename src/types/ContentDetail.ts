// 콘텐츠 관련한 타입들을 모아놓은 파일
export interface ContentCategory {
  category: string;
  genres: string[]; // "SF", "코미디" → 배열로 처리
}

export interface ContentPlatform {
  platformType: string;
  watchUrl: string;
  isAvailable: boolean; // 문자열로 받지만 boolean으로 파싱
}

export interface ContentDetail {
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
  categories: ContentCategory[];
  countries?: string[];
  directors?: string[];
  casts?: string[];
  platforms: ContentPlatform[];
}
