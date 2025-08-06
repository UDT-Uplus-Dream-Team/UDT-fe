import { adminGenre } from '@type/admin/user';

//장르 목록 정의
export const GENRES: adminGenre[] = [
  { label: '액션', id: 'action' },
  { label: '판타지', id: 'fantasy' },
  { label: 'SF', id: 'sf' },
  { label: '스릴러', id: 'thriller' },
  { label: '미스터리', id: 'mystery' },
  { label: '어드벤처', id: 'adventure' },
  { label: '뮤지컬', id: 'musical' },
  { label: '코미디', id: 'comedy' },
  { label: '서부극', id: 'western' },
  { label: '멜로/로맨스', id: 'romance' },
  { label: '서사/드라마', id: 'drama' },
  { label: '애니메이션', id: 'animation' },
  { label: '공포(호러)', id: 'horror' },
  { label: '다큐멘터리', id: 'documentary' },
  { label: '범죄', id: 'crime' },
  { label: '무협', id: 'martial-arts' },
  { label: '사극/시대극', id: 'historical-drama' },
  { label: '성인', id: 'adult' },
  { label: '키즈', id: 'kids' },
  { label: '버라이어티', id: 'variety' },
  { label: '토크쇼', id: 'talk-show' },
  { label: '서바이벌', id: 'survival' },
  { label: '리얼리티', id: 'reality' },
  { label: '스탠드업코미디', id: 'stand-up-comedy' },
];

//매핑용 구조체
export const GENRE_LABEL_MAP: Record<string, string> = GENRES.reduce(
  (acc, genre) => {
    acc[genre.id.toUpperCase().replace(/-/g, '_')] = genre.label;
    return acc;
  },
  {} as Record<string, string>,
);

//실사용 함수
export const getGenreLabel = (raw: string) =>
  GENRE_LABEL_MAP[raw.toUpperCase().replace(/-/g, '_')] || raw;

// 장르별 색상 고정
export const GENRE_COLOR_MAP: Record<string, string> = {
  ACTION: '#F7BEAD',
  FANTASY: '#EFC2D6',
  SF: '#EFC9DE',
  THRILLER: '#BDD2EF',
  MYSTERY: '#C5E7D6',
  ADVENTURE: '#DEE7A6',
  MUSICAL: '#F8EFB6',
  COMEDY: '#F8CE9C',
  WESTERN: '#EF929C',
  ROMANCE: '#F0A5CE',
  DRAMA: '#BD96C5',
  ANIMATION: '#85B6DE',
  HORROR: '#8ECEB6',
  DOCUMENTARY: '#D5E561',
  CRIME: '#F7DC6B',
  MARTIAL_ARTS: '#F7B264',
  HISTORICAL_DRAMA: '#E64D52',
  ADULT: '#DF51A5',
  KIDS: '#834DA5',
  VARIETY: '#4A74BC',
  TALK_SHOW: '#429A84',
  SURVIVAL: '#BCD74A',
  REALITY: '#F7BB43',
  STAND_UP_COMEDY: '#F07531',
};

export const getGenreColor = (raw: string) =>
  GENRE_COLOR_MAP[raw.toUpperCase().replace(/-/g, '_')] || '#CCCCCC';
