import { MovieCardProps } from '@/types/mypage/Mypage';
import { RecommendedContent } from '@type/mypage/RecommendedContent';

export const likedPosters: RecommendedContent[] = [
  {
    contentId: 1,
    title: '귀를 기울이면',
    posterUrl: '/images/poster1.webp',
    rating: '전체 관람가',
    genre: ['판타지', '모험'],
    countries: ['일본'],
    platform: ['넷플릭스', '디즈니+'],
    categories: ['애니'],
  },
  {
    contentId: 2,
    title: '고양이의 보은',
    posterUrl: '/images/poster2.webp',
    rating: '12세 이상 관람가',
    genre: ['드라마', '로맨스'],
    countries: ['일본'],
    platform: ['왓챠'],
    categories: ['애니'],
  },
  {
    contentId: 3,
    title: '벼랑위의 포뇨',
    posterUrl: '/images/poster3.webp',
    rating: '전체 관람가',
    genre: ['가족', '힐링'],
    countries: ['일본'],
    platform: ['넷플릭스'],
    categories: ['애니'],
  },
  {
    contentId: 4,
    title: '어벤져스',
    posterUrl: '/images/poster4.webp',
    rating: '15세 이상 관람가',
    genre: ['판타지', '액션'],
    countries: ['미국'],
    platform: ['디즈니+'],
    categories: ['영화'],
  },
];

export const dislikedPosters: RecommendedContent[] = [
  {
    contentId: 1,
    title: '귀를 기울이면',
    posterUrl: '/images/poster1.webp',
    rating: '전체 관람가',
    genre: ['판타지', '모험'],
    countries: ['일본'],
    platform: ['넷플릭스', '디즈니+'],
    categories: ['애니'],
  },
  {
    contentId: 2,
    title: '고양이의 보은',
    posterUrl: '/images/poster2.webp',
    rating: '12세 이상 관람가',
    genre: ['드라마', '로맨스'],
    countries: ['일본'],
    platform: ['왓챠'],
    categories: ['애니'],
  },
  {
    contentId: 3,
    title: '벼랑위의 포뇨',
    posterUrl: '/images/poster3.webp',
    rating: '전체 관람가',
    genre: ['가족', '힐링'],
    countries: ['일본'],
    platform: ['넷플릭스'],
    categories: ['애니'],
  },
  {
    contentId: 4,
    title: '어벤져스',
    posterUrl: '/images/poster4.webp',
    rating: '15세 이상 관람가',
    genre: ['판타지', '액션'],
    countries: ['일본'],
    platform: ['디즈니+'],
    categories: ['영화'],
  },
  {
    contentId: 5,
    title: '어벤져스',
    posterUrl: '/images/poster4.webp',
    rating: '15세 이상 관람가',
    genre: ['판타지', '액션'],
    countries: ['일본'],
    platform: ['디즈니+'],
    categories: ['영화'],
  },
];

export const mockModalMovieDataList: MovieCardProps[] = [
  {
    contentId: 1,
    title: '귀를 기울이면',
    genres: ['판타지', '모험'],
    runtime: '125분',
    releaseDate: '2001-07-20',
    rating: '전체 관람가',
    description:
      '10살 소녀 치히로가 신비로운 세계에서 부모를 구하고 성장하는 이야기입니다.',
    thumbnailUrl: '/images/poster1.webp',
    platformList: [
      {
        name: '넷플릭스',
        url: 'https://www.netflix.com',
      },
      {
        name: '디즈니+',
        url: 'https://www.disneyplus.com',
      },
    ],
  },
  {
    contentId: 2,
    title: '고양이의 보은',
    genres: ['가족', '힐링'],
    runtime: '86분',
    releaseDate: '1988-04-16',
    rating: '전체 관람가',
    description:
      '시골로 이사 온 두 자매가 숲속 생명체 토토로를 만나며 겪는 따뜻한 이야기입니다.',
    thumbnailUrl: '/images/poster2.webp',
    platformList: [
      {
        name: '왓챠',
        url: 'https://watcha.com',
      },
    ],
  },
  {
    contentId: 3,
    title: '벼랑위의 포뇨',
    genres: ['드라마', '로맨스'],
    runtime: '126분',
    releaseDate: '2013-07-20',
    rating: '12세 이상 관람가',
    description:
      '항공기 디자이너 지로가 시대의 소용돌이 속에서 꿈과 사랑을 찾아가는 이야기입니다.',
    thumbnailUrl: '/images/poster3.webp',
    platformList: [
      {
        name: '왓챠',
        url: 'https://watcha.com',
      },
    ],
  },
  {
    contentId: 4,
    title: '어벤져스',
    genres: ['판타지', '액션'],
    runtime: '134분',
    releaseDate: '1997-07-12',
    rating: '15세 이상 관람가',
    description:
      '산의 정령과 인간 간의 갈등 속에서 자연과의 조화를 모색하는 한 소년의 여정.',
    thumbnailUrl: '/images/poster4.webp',
    platformList: [
      {
        name: '디즈니+',
        url: 'https://www.disneyplus.com',
      },
    ],
  },
];

export const mockModalDislikedMovieDataList: MovieCardProps[] = [
  {
    contentId: 1,
    title: '센과 치히로의 행방불명',
    genres: ['판타지', '모험'],
    runtime: '125분',
    releaseDate: '2001-07-20',
    rating: '전체 관람가',
    description:
      '10살 소녀 치히로가 신비로운 세계에서 부모를 구하고 성장하는 이야기입니다.',
    thumbnailUrl: '/images/poster1.webp',
    platformList: [
      {
        name: '넷플릭스',
        url: 'https://www.netflix.com',
      },
      {
        name: '디즈니+',
        url: 'https://www.disneyplus.com',
      },
    ],
  },
  {
    contentId: 2,
    title: '바람이 분다',
    genres: ['드라마', '로맨스'],
    runtime: '126분',
    releaseDate: '2013-07-20',
    rating: '12세 이상 관람가',
    description:
      '항공기 디자이너 지로가 시대의 소용돌이 속에서 꿈과 사랑을 찾아가는 이야기입니다.',
    thumbnailUrl: '/images/poster2.webp',
    platformList: [
      {
        name: '왓챠',
        url: 'https://watcha.com',
      },
    ],
  },
  {
    contentId: 3,
    title: '이웃집 토토로',
    genres: ['가족', '힐링'],
    runtime: '86분',
    releaseDate: '1988-04-16',
    rating: '전체 관람가',
    description:
      '시골로 이사 온 두 자매가 숲속 생명체 토토로를 만나며 겪는 따뜻한 이야기입니다.',
    thumbnailUrl: '/images/poster3.webp',
    platformList: [
      {
        name: '넷플릭스',
        url: 'https://www.netflix.com',
      },
    ],
  },
  {
    contentId: 4,
    title: '어벤져스',
    genres: ['판타지', '액션'],
    runtime: '134분',
    releaseDate: '1997-07-12',
    rating: '15세 이상 관람가',
    description:
      '산의 정령과 인간 간의 갈등 속에서 자연과의 조화를 모색하는 한 소년의 여정.',
    thumbnailUrl: '/images/poster4.webp',
    platformList: [
      {
        name: '디즈니+',
        url: 'https://www.disneyplus.com',
      },
    ],
  },
  {
    contentId: 5,
    title: '모노노케 히메',
    genres: ['판타지', '액션'],
    runtime: '134분',
    releaseDate: '1997-07-12',
    rating: '15세 이상 관람가',
    description:
      '산의 정령과 인간 간의 갈등 속에서 자연과의 조화를 모색하는 한 소년의 여정.',
    thumbnailUrl: '/images/poster4.webp',
    platformList: [
      {
        name: '디즈니+',
        url: 'https://www.disneyplus.com',
      },
    ],
  },
];
