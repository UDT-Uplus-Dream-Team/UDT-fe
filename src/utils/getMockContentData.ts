import { getYouTubeEmbedUrl } from '@utils/getYouTubeEmbedUrl';
import { RecentContentData } from '@type/explore/Explore';

// TODO: 추후 이것들은 삭제될 예정 (임시로 데이터 넣어둠)
export interface MockContentData {
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  openDate: string;
  runningTime: number;
  episode: number;
  rating: string;
  countries: string[];
  casts: { name: string; image: string }[];
  directors: { name: string }[];
  categories: { category: string; genres: string[] }[];
  platforms: { platformType: string; watchUrl: string }[];
}

// TODO: 추후 이것들은 삭제될 예정 (임시로 데이터 넣어둠)
export const mockRecentContentData: RecentContentData[] = [
  {
    contentId: 1,
    title: '주토피아',
    posterUrl: '/images/mockPoster/zootopia-poster.webp',
    categories: [{ category: '애니메이션', genres: ['SF', '코미디'] }],
  },
  {
    contentId: 2,
    title: '타짜',
    posterUrl: '/images/mockPoster/tazza-poster.webp',
    categories: [{ category: '액션', genres: ['액션', '드라마'] }],
  },
  {
    contentId: 3,
    title: '인사이드 아웃',
    posterUrl: '/images/mockPoster/insideout-poster.webp',
    categories: [{ category: '애니메이션', genres: ['SF', '코미디'] }],
  },
  {
    contentId: 4,
    title: '이웃집 토토로',
    posterUrl: '/images/mockPoster/totoro-poster.webp',
    categories: [{ category: '애니메이션', genres: ['SF', '코미디'] }],
  },
  {
    contentId: 5,
    title: '센과 치히로의 행방불명',
    posterUrl: '/images/mockPoster/sen-poster.webp',
    categories: [{ category: '애니메이션', genres: ['SF', '코미디'] }],
  },
  {
    contentId: 6,
    title: '하울의 움직이는 성',
    posterUrl: '/images/mockPoster/haul-poster.webp',
    categories: [{ category: '애니메이션', genres: ['SF', '코미디'] }],
  },
  {
    contentId: 7,
    title: '바람계곡의 나우시카',
    posterUrl: '/images/mockPoster/nausika-poster.webp',
    categories: [{ category: '애니메이션', genres: ['SF', '코미디'] }],
  },
  {
    contentId: 8,
    title: '마녀 배달부 키키',
    posterUrl: '/images/mockPoster/kiki-poster.webp',
    categories: [{ category: '애니메이션', genres: ['SF', '코미디'] }],
  },
  {
    contentId: 9,
    title: '모노노케 히메',
    posterUrl: '/images/mockPoster/hime-poster.webp',
    categories: [{ category: '애니메이션', genres: ['SF', '코미디'] }],
  },
];

// TODO: 추후 이것들은 삭제될 예정 (임시로 데이터 넣어둠)
export const mockfilteredContentData: RecentContentData[] = [
  {
    contentId: 10,
    title: '라푼젤',
    posterUrl: '/images/mockPoster/rapunzel-poster.webp',
    categories: [{ category: '애니메이션', genres: ['모험', '로맨스'] }],
  },
  {
    contentId: 11,
    title: '코코',
    posterUrl: '/images/mockPoster/coco-poster.webp',
    categories: [{ category: '애니메이션', genres: ['음악', '가족'] }],
  },
  {
    contentId: 12,
    title: '벼랑 위의 포뇨',
    posterUrl: '/images/mockPoster/ponyo-poster.webp',
    categories: [{ category: '애니메이션', genres: ['판타지', '가족'] }],
  },
  {
    contentId: 13,
    title: '업',
    posterUrl: '/images/mockPoster/up-poster.webp',
    categories: [{ category: '애니메이션', genres: ['모험', '감동'] }],
  },
  {
    contentId: 14,
    title: '루카',
    posterUrl: '/images/mockPoster/luca-poster.webp',
    categories: [{ category: '애니메이션', genres: ['성장', '우정'] }],
  },
];

// Mock 데이터를 contentId에 따라 반환하는 함수
const mockDataMap: Record<number, MockContentData> = {
  1: {
    title: '주토피아',
    description:
      '토끼 경찰 주디 홉스와 여우 사기꾼 닉 와일드가 차별과 편견을 극복하며 공조 수사를 벌이는 이야기.',
    posterUrl: '/images/mockPoster/zootopia-poster.webp',
    backdropUrl: '/images/mockdata/zootopia.jpg',
    trailerUrl: getYouTubeEmbedUrl(
      'https://www.youtube.com/watch?v=K4OJXmoakF4',
    ),
    openDate: '2019-01-17',
    runningTime: 104,
    episode: 1,
    rating: '전체 관람가',
    countries: ['미국'],
    casts: [
      { name: '주디 홉스', image: '/images/mockdata/judy.webp' },
      { name: '닉 와일드', image: '/images/mockdata/nick.jpeg' },
    ],
    directors: [{ name: '바이런 하워드' }, { name: '리치 무어' }],
    categories: [{ category: '애니메이션', genres: ['판타지', '코미디'] }],
    platforms: [
      { platformType: '디즈니+', watchUrl: 'https://disneyplus.com' },
    ],
  },
  2: {
    title: '타짜',
    description:
      '도박판의 세계에 발을 들인 고니의 복수극. 화투판 위에서 펼쳐지는 치열한 심리전.',
    posterUrl: '/images/mockPoster/tazza-poster.webp',
    backdropUrl: '/images/mockdata/tazza-backdrop.webp',
    trailerUrl: getYouTubeEmbedUrl(
      'https://www.youtube.com/watch?v=vLHyh8F-vQo',
    ),
    openDate: '2006-09-28',
    runningTime: 139,
    episode: 1,
    rating: '청소년 관람불가',
    countries: ['한국'],
    casts: [
      { name: '조승우', image: '/images/mockdata/judy.webp' },
      { name: '김혜수', image: '/images/mockdata/nick.jpeg' },
    ],
    directors: [{ name: '최동훈' }],
    categories: [{ category: '영화', genres: ['범죄', '드라마'] }],
    platforms: [{ platformType: '왓챠', watchUrl: 'https://watcha.com' }],
  },
  3: {
    title: '인사이드 아웃',
    description:
      '감정들이 주인공이 된 독특한 설정의 픽사 애니메이션. 아이의 성장과 정체성을 다룬 감동적인 여정.',
    posterUrl: '/images/mockPoster/insideout-poster.webp',
    backdropUrl: '/images/mockdata/insideout-backdrop.webp',
    trailerUrl: getYouTubeEmbedUrl(
      'https://www.youtube.com/watch?v=1KGZtWbZtq8',
    ),
    openDate: '2015-06-19',
    runningTime: 94,
    episode: 1,
    rating: '전체 관람가',
    countries: ['미국'],
    casts: [
      { name: '기쁨이', image: '/images/mockdata/hops.webp' },
      { name: '슬픔이', image: '/images/mockdata/choonsik.webp' },
    ],
    directors: [{ name: '피트 닥터' }],
    categories: [{ category: '애니메이션', genres: ['가족', '판타지'] }],
    platforms: [
      { platformType: '디즈니+', watchUrl: 'https://disneyplus.com' },
    ],
  },
  4: {
    title: '이웃집 토토로',
    description:
      '자매와 숲의 정령 토토로의 만남. 순수함과 자연의 조화를 그린 힐링 애니메이션.',
    posterUrl: '/images/mockPoster/totoro-poster.webp',
    backdropUrl: '/images/mockdata/totoro-backdrop.webp',
    trailerUrl: getYouTubeEmbedUrl(
      'https://www.youtube.com/watch?v=yrqmx630BIA',
    ),
    openDate: '1988-04-16',
    runningTime: 86,
    episode: 1,
    rating: '전체 관람가',
    countries: ['일본'],
    casts: [
      { name: '사츠키', image: '/images/mockdata/placeholder.jpg' },
      { name: '메이', image: '/images/mockdata/placeholder.jpg' },
    ],
    directors: [{ name: '미야자키 하야오' }],
    categories: [{ category: '애니메이션', genres: ['판타지', '가족'] }],
    platforms: [{ platformType: '넷플릭스', watchUrl: 'https://netflix.com' }],
  },
  5: {
    title: '센과 치히로의 행방불명',
    description:
      '이름을 빼앗긴 소녀 치히로가 신비한 세계에서 자아를 찾아가는 판타지 대서사시.',
    posterUrl: '/images/mockPoster/sen-poster.webp',
    backdropUrl: '/images/mockdata/sen-backdrop.webp',
    trailerUrl: getYouTubeEmbedUrl(
      'https://www.youtube.com/watch?v=lwrG3HQXTFw',
    ),
    openDate: '2001-07-20',
    runningTime: 125,
    episode: 1,
    rating: '전체 관람가',
    countries: ['일본'],
    casts: [
      { name: '치히로', image: '/images/mockdata/placeholder.jpg' },
      { name: '하쿠', image: '/images/mockdata/placeholder.jpg' },
    ],
    directors: [{ name: '미야자키 하야오' }],
    categories: [{ category: '애니메이션', genres: ['판타지', '모험'] }],
    platforms: [
      {
        platformType: '넷플릭스',
        watchUrl: 'https://netflix.com',
      },
    ],
  },
  6: {
    title: '하울의 움직이는 성',
    description:
      '노파가 된 소피가 하울과 함께 전쟁과 마법이 얽힌 세계를 여행하는 판타지 로맨스.',
    posterUrl: '/images/mockPoster/haul-poster.webp',
    backdropUrl: '/images/mockdata/haul-backdrop.jpeg',
    trailerUrl: getYouTubeEmbedUrl(
      'https://www.youtube.com/watch?v=YpqMZt1gOXU',
    ),
    openDate: '2004-11-20',
    runningTime: 119,
    episode: 1,
    rating: '전체 관람가',
    countries: ['일본'],
    casts: [
      { name: '소피', image: '/images/mockdata/placeholder.jpg' },
      { name: '하울', image: '/images/mockdata/placeholder.jpg' },
    ],
    directors: [{ name: '미야자키 하야오' }],
    categories: [{ category: '애니메이션', genres: ['로맨스', '전쟁'] }],
    platforms: [{ platformType: '넷플릭스', watchUrl: 'https://netflix.com' }],
  },
  7: {
    title: '바람계곡의 나우시카',
    description: '오염된 대지에서 평화를 추구하는 공주 나우시카의 생태 판타지.',
    posterUrl: '/images/mockPoster/nausika-poster.webp',
    backdropUrl: '/images/mockdata/nausika-backdrop.webp',
    trailerUrl: getYouTubeEmbedUrl(
      'https://www.youtube.com/watch?v=3aZZemdUu0c',
    ),
    openDate: '1984-03-11',
    runningTime: 117,
    episode: 1,
    rating: '전체 관람가',
    countries: ['일본'],
    casts: [
      { name: '나우시카', image: '/images/mockdata/placeholder.jpg' },
      { name: '아스벨', image: '/images/mockdata/placeholder.jpg' },
    ],
    directors: [{ name: '미야자키 하야오' }],
    categories: [{ category: '애니메이션', genres: ['SF', '환경'] }],
    platforms: [{ platformType: '넷플릭스', watchUrl: 'https://netflix.com' }],
  },
  8: {
    title: '마녀 배달부 키키',
    description: '자립을 시작한 13살 마녀 키키의 성장과 배달 모험.',
    posterUrl: '/images/mockPoster/kiki-poster.webp',
    backdropUrl: '/images/mockdata/kiki-backdrop.webp',
    trailerUrl: getYouTubeEmbedUrl(
      'https://www.youtube.com/watch?v=zbvx7pqw5Gg',
    ),
    openDate: '1989-07-29',
    runningTime: 103,
    episode: 1,
    rating: '전체 관람가',
    countries: ['일본'],
    casts: [
      { name: '키키', image: '/images/mockdata/placeholder.jpg' },
      { name: '지지', image: '/images/mockdata/placeholder.jpg' },
    ],
    directors: [{ name: '미야자키 하야오' }],
    categories: [{ category: '애니메이션', genres: ['성장', '힐링'] }],
    platforms: [{ platformType: '넷플릭스', watchUrl: 'https://netflix.com' }],
  },
  9: {
    title: '모노노케 히메',
    description:
      '인간과 자연의 대립 속에서 진실을 찾아가는 청년 아시타카의 여정.',
    posterUrl: '/images/mockPoster/hime-poster.webp',
    backdropUrl: '/images/mockdata/hime-backdrop.jpg',
    trailerUrl: getYouTubeEmbedUrl(
      'https://www.youtube.com/watch?v=YOuG8m2RqOs',
    ),
    openDate: '1997-07-12',
    runningTime: 134,
    episode: 1,
    rating: '12세 이상',
    countries: ['일본'],
    casts: [
      { name: '아시타카', image: '/images/mockdata/placeholder.jpg' },
      { name: '산', image: '/images/mockdata/placeholder.jpg' },
    ],
    directors: [{ name: '미야자키 하야오' }],
    categories: [{ category: '애니메이션', genres: ['판타지', '모험'] }],
    platforms: [{ platformType: '넷플릭스', watchUrl: 'https://netflix.com' }],
  },
  10: {
    title: '라푼젤',
    description:
      '탑 속에 갇혀 지내던 라푼젤이 자유를 찾아 떠나는 모험과 자아 발견의 이야기.',
    posterUrl: '/images/mockPoster/rapunzel-poster.webp',
    backdropUrl: '/images/mockdata/rapunzel-backdrop.webp',
    trailerUrl: getYouTubeEmbedUrl(
      'https://www.youtube.com/watch?v=ZYpzpl4Tzqw',
    ),
    openDate: '2010-11-24',
    runningTime: 100,
    episode: 1,
    rating: '전체관람가',
    countries: ['미국'],
    casts: [
      { name: '라푼젤', image: '/images/mockdata/placeholder.jpg' },
      { name: '플린 라이더', image: '/images/mockdata/placeholder.jpg' },
    ],
    directors: [{ name: '네이선 그레노' }, { name: '바이런 하워드' }],
    categories: [{ category: '애니메이션', genres: ['모험', '로맨스'] }],
    platforms: [
      { platformType: '디즈니+', watchUrl: 'https://disneyplus.com' },
    ],
  },
  11: {
    title: '코코',
    description:
      '죽은 자들의 세상으로 간 소년 미겔이 가족과 음악의 소중함을 깨닫는 감동 스토리.',
    posterUrl: '/images/mockPoster/coco-poster.webp',
    backdropUrl: '/images/mockdata/coco-backdrop.webp',
    trailerUrl: getYouTubeEmbedUrl(
      'https://www.youtube.com/watch?v=Ga6RYejo6Hk',
    ),
    openDate: '2017-11-24',
    runningTime: 105,
    episode: 1,
    rating: '전체관람가',
    countries: ['미국'],
    casts: [
      { name: '미겔', image: '/images/mockdata/placeholder.jpg' },
      { name: '헥터', image: '/images/mockdata/placeholder.jpg' },
    ],
    directors: [{ name: '리 언크리치' }],
    categories: [{ category: '애니메이션', genres: ['음악', '가족'] }],
    platforms: [
      { platformType: '디즈니+', watchUrl: 'https://disneyplus.com' },
    ],
  },
  12: {
    title: '벼랑 위의 포뇨',
    description:
      '물고기 소녀 포뇨와 소스케의 만남, 그리고 세상을 구하는 마법 같은 우정 이야기.',
    posterUrl: '/images/mockPoster/ponyo-poster.webp',
    backdropUrl: '/images/mockdata/ponyo-backdrop.webp',
    trailerUrl: getYouTubeEmbedUrl(
      'https://www.youtube.com/watch?v=qV1Mzw9Gir8',
    ),
    openDate: '2008-07-19',
    runningTime: 101,
    episode: 1,
    rating: '전체관람가',
    countries: ['일본'],
    casts: [
      { name: '포뇨', image: '/images/mockdata/placeholder.jpg' },
      { name: '소스케', image: '/images/mockdata/placeholder.jpg' },
    ],
    directors: [{ name: '미야자키 하야오' }],
    categories: [{ category: '애니메이션', genres: ['판타지', '가족'] }],
    platforms: [{ platformType: '넷플릭스', watchUrl: 'https://netflix.com' }],
  },
  13: {
    title: '업',
    description:
      '하늘을 나는 집과 함께 떠나는 노인 칼과 소년 러셀의 감동 모험 이야기.',
    posterUrl: '/images/mockPoster/up-poster.webp',
    backdropUrl: '/images/mockdata/up-backdrop.webp',
    trailerUrl: getYouTubeEmbedUrl(
      'https://www.youtube.com/watch?v=6J6ADorSeYc',
    ),
    openDate: '2009-05-29',
    runningTime: 96,
    episode: 1,
    rating: '전체관람가',
    countries: ['미국'],
    casts: [
      { name: '칼 프레드릭슨', image: '/images/mockdata/placeholder.jpg' },
      { name: '러셀', image: '/images/mockdata/placeholder.jpg' },
    ],
    directors: [{ name: '피트 닥터' }],
    categories: [{ category: '애니메이션', genres: ['모험', '감동'] }],
    platforms: [
      { platformType: '디즈니+', watchUrl: 'https://disneyplus.com' },
    ],
  },
  14: {
    title: '루카',
    description:
      '바닷속 괴물 소년 루카가 인간 세계에서 겪는 우정과 성장을 그린 여름 이야기.',
    posterUrl: '/images/mockPoster/luca-poster.webp',
    backdropUrl: '/images/mockdata/luca-backdrop.webp',
    trailerUrl: getYouTubeEmbedUrl(
      'https://www.youtube.com/watch?v=mYfJxlgR2jw',
    ),
    openDate: '2021-06-18',
    runningTime: 95,
    episode: 1,
    rating: '전체관람가',
    countries: ['미국'],
    casts: [
      { name: '루카', image: '/images/mockdata/placeholder.jpg' },
      { name: '알베르토', image: '/images/mockdata/placeholder.jpg' },
    ],
    directors: [{ name: '엔리코 카사로사' }],
    categories: [{ category: '애니메이션', genres: ['성장', '우정'] }],
    platforms: [
      { platformType: '디즈니+', watchUrl: 'https://disneyplus.com' },
    ],
  },
};

export const getMockContentData = (contentId: number): MockContentData => {
  return mockDataMap[contentId] ?? mockDataMap[1];
};
