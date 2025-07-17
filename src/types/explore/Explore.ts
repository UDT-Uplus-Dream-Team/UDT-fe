import type { StaticImageData } from 'next/image';

// FilterRadioButton 컴포넌트의 props 타입 정의
export interface FilterRadioButtonProps {
  label: string; // 라디오 버튼에 들어갈 글자 (value로도 사용)
  isSelected?: boolean; // 선택된 상태
  onToggle?: (label: string) => void; // 토글 시 호출될 콜백
}

// 상세 보기가 아닌 카드 목록에 사용되는 콘텐츠 데이터 타입 (간단하게 포스터, 제목만 표시하는 버전)
export interface SimpleContentData {
  contendId: number;
  title: string;
  posterUrl: string;
}

// 카테고리 관련 타입 (대분류/소분류를 한 DTO에 묶어서 사용)
export interface CategoryDTO {
  category: string;
  genres: string[];
}

// 탐색 창 메인에 큰 카드에 사용되는 콘텐츠 데이터 타입
export interface RecentContentData extends SimpleContentData {
  categories: CategoryDTO[];
}

// "상세 보기"에 사용되는 콘텐츠 데이터 타입
export interface DetailContentData {
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  openDate: string; // ISO 형식의 날짜 문자열
  runningTime: number; // 단위: 분
  episode: number;
  rating: string;

  categories: {
    category: string;
    genres: string[]; // 예: ["SF", "코미디"]
  }[];

  countries: string[]; // 예: ["미국", "영국"]
  directors: string[]; // 예: ["봉준호", "스티븐 스필버그"]
  casts: string[]; // 예: ["이가인", "영따이"]

  platforms: {
    platformType: string; // 예: "넷플릭스"
    watchUrl: string | null; // 예: "https://netflix.com"
  }[];
}

// PosterCard 컴포넌트의 props 타입 정의
export interface PosterCardProps {
  title: string;
  image: string | StaticImageData;
  isTitleVisible?: boolean;
  onClick: () => void;
}

// 영화 카드 스크롤 박스에 사용되는 영화 데이터 타입 (간단하게 포스터, 제목만 표시하는 버전)
export interface SimpleMovieData {
  id: number;
  title: string;
  image: string;
}

// 회원 정보 타입
export interface UserInfo {
  name: string;
  email: string;
  genres: string[]; // 선호 장르
  ott: string[]; // 선호 OTT
  profileImageUrl: string; // 프로필 이미지 URL
}

// 콘텐츠 하나
export interface ExploreContent {
  contentId: number;
  poster_url: string;
}

// API 요청 파라미터
export interface FetchExploreParams {
  cursor?: number;
  size: number;
  type?: string;
  genre?: string;
}

// API 응답 데이터
export interface FetchExploreResponse {
  contents: ExploreContent[];
  nextCursor: number;
  hasNext: boolean;
}
