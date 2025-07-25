import type { StaticImageData } from 'next/image';

// FilterRadioButton 컴포넌트의 props 타입 정의
export interface FilterRadioButtonProps {
  label: string; // 라디오 버튼에 들어갈 글자 (value로도 사용)
  isSelected?: boolean; // 선택된 상태
  onToggle?: (label: string) => void; // 토글 시 호출될 콜백
}

// 상세 보기가 아닌 카드 목록에 사용되는 콘텐츠 데이터 타입 (간단하게 포스터, 제목만 표시하는 버전)
export interface SimpleContentData {
  contentId: number;
  title?: string; // 영화 제목은 들어갈 수도 있고 아닐수도 있다
  posterUrl: string;
}

// 탐색 창 메인에 큰 카드에 사용되는 콘텐츠 데이터 타입
export interface RecentContentData extends SimpleContentData {
  categories: string[];
  genres: string[];
}

// "상세 보기"에 사용되는 콘텐츠 데이터 타입
export interface DetailedContentData {
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  openDate: string; // ISO 형식의 날짜 문자열
  runningTime: number; // 단위: 분
  episode: number;
  rating: string;
  categories: string[];
  genres: string[]; // 예: ["SF", "코미디"]

  countries: string[]; // 예: ["미국", "영국"]
  directors: string[];
  casts: { castName: string; castImageUrl: string }[];

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

// 회원 정보 타입 (Explore 페이지에서 OTT 정보를 들고 오기 위해 사용)
export interface UserInfo {
  name: string;
  email: string;
  genres: string[]; // 선호 장르
  ott: string[]; // 선호 OTT
  profileImageUrl: string; // 프로필 이미지 URL
}
