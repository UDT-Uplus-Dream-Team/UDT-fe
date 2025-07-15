// 필터링할 때 사용하는 타입들

export interface CategoryDTO {
  category: string; // 대분류
  genres: string[]; // 세부 장르(액션, 호러 등)
}

// 필터링된 콘텐츠 타입 (탐색 페이지 메인에서 간단하게 보이는 부분)
export interface FilteredContent {
  contentId: number;
  title: string;
  description: string;
  posterUrl: string;
  categories: CategoryDTO[];
}

// 필터링 요청 시 Response에 받는 타입
export interface GetFilteredContentResponse {
  contents: FilteredContent[];
  nextCursor: number | null;
  hasNext: boolean;
}

// 필터링 요청 시 Request Body에 보내는 타입
export interface GetFilteredContentRequest {
  categories: string[]; // 대분류 (영화, 드라마, 애니메이션, 예능)
  platforms: string[]; // OTT
  countries: string[]; // 국가
  openDates: string[]; // 개봉일
  ratings: string[]; // 관람등급
  genres: string[]; // 세부 장르(액션, 호러 등)
}
