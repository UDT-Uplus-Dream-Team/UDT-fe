import type { StaticImageData } from 'next/image';

// "탐색 페이지"에서 사용되는 컨텍스트 타입 정의
export interface ExplorePageContextType {
  filterOptions: string[]; // 목록 상단에 표시될 필터 옵션들
  hasUserData: boolean; // 사용자 정보 존재 여부
  isBottomSheetOpen: boolean; // 필터 BottomSheet 열림 여부
  displayedOptionsInTop: string[]; // UI에 표시될 모든 옵션들 (기본 + 선택된 옵션들)
  currentSelectedOptions: string[]; // 현재 선택된 옵션들 (BottomSheet 상태에 따라 temp 또는 실제)
  openBottomSheet: () => void; // 필터 BottomSheet 열기 함수
  closeBottomSheet: () => void; // 필터 BottomSheet 닫기 함수
  confirmBottomSheet: () => void; // 필터 BottomSheet 확정 함수
  toggleOption: (label: string, isSelected: boolean) => void; // 필터 옵션 토글 함수
  clearSelectedOptions: () => void; // 선택된 옵션들 초기화 함수
}

// FilterRadioButton 컴포넌트의 props 타입 정의
export interface FilterRadioButtonProps {
  label: string; // 라디오 버튼에 들어갈 글자 (value로도 사용)
  isSelected?: boolean; // 선택된 상태
  onToggle?: (label: string, isSelected: boolean) => void; // 토글 시 호출될 콜백
}

export type MovieData = {
  contentId: number;
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  openDate: string;
  runtimeTime: number;
  rating: string;
  categories: string[];
  genres: string[];
  directors: string[];
  platforms: string[];
};

// PosterCard 컴포넌트의 props 타입 정의
export interface PosterCardProps {
  title: string;
  image: string | StaticImageData;
  isTitleVisible?: boolean;
  onClick: () => void;
}

export interface PosterCardScrollBoxProps {
  title: string;
  SimpleMovieData: SimpleMovieData[];
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
