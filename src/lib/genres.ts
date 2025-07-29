import { Genre } from '@type/Genre';

export const GENRES: Genre[] = [
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

// 카테고리별 허용 장르
export const MOVIE_GENRES: string[] = [
  '스릴러',
  '액션',
  '어드벤처',
  '드라마',
  '코미디',
  '멜로/로맨스',
  '판타지',
  '미스터리',
  '공포(호러)',
  '범죄',
  '애니메이션',
  '다큐멘터리',
  'SF',
  '사극/시대극',
  '뮤지컬',
];

export const DRAMA_GENRES: string[] = [
  '멜로/로맨스',
  '드라마',
  '코미디',
  '액션',
  '미스터리',
  '스릴러',
  '범죄',
  '판타지',
  '공포(호러)',
  '어드벤처',
  '사극/시대극',
  'SF',
  '다큐멘터리',
];

export const VARIETY_GENRES: string[] = [
  '리얼리티',
  '토크쇼',
  '버라이어티',
  '서바이벌',
  '코미디',
  '다큐멘터리',
  '스탠드업코미디',
  '멜로/로맨스',
];

export const ANIMATION_GENRES: string[] = [
  'SF',
  '드라마',
  '액션',
  '스릴러',
  '미스터리',
  '판타지',
  '멜로/로맨스',
  '코미디',
  '사극/시대극',
  '애니메이션',
  '키즈',
  '어드벤처',
  '공포(호러)',
  '뮤지컬',
  '범죄',
  '성인',
];

// 카테고리에 따른 장르 반환 함수
export const getGenresByCategory = (category: string): string[] => {
  switch (category) {
    case '영화':
      return MOVIE_GENRES;
    case '드라마':
      return DRAMA_GENRES;
    case '예능':
      return VARIETY_GENRES;
    case '애니메이션':
      return ANIMATION_GENRES;
    default:
      return GENRES.map((genre) => genre.label);
  }
};
