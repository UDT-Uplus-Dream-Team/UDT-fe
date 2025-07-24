import { SimpleContentData } from '@type/explore/Explore';

// 필터링할 때 사용하는 타입들
export interface ContentSearchConditionDTO {
  categories: string[];
  platforms: string[];
  countries: string[];
  openDates: string[]; // ISO 8601 datetime string
  ratings: string[];
  genres: string[];
}

// 필터링 요청 시 Request Body에 보내는 타입
export interface FilterContentRequest {
  cursor: string | null;
  size: number;
  categories: string[];
  platforms: string[];
  countries: string[];
  openDates: string[]; // ISO 8601 datetime string
  ratings: string[];
  genres: string[];
}

// 필터링 요청 시 Response에 받는 타입
export interface FilteredContentResponse {
  item: SimpleContentData[];
  nextCursor: string | null;
  hasNext: boolean;
}
