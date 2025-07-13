import { MovieCardProps } from '@/types/mypage/Mypage';
import { RecommendedContent } from '@/types/mypage/RecommendedContent';

export const recommendedPosters: RecommendedContent[] = [
  {
    contentId: 1,
    title: '센과 치히로의 행방불명',
    posterUrl: '/images/poster1.webp',
    rating: '전체 관람가',
    genre: ['판타지', '모험'],
    countries: ['일본'],
    platform: ['넷플릭스', '디즈니+'],
    categories: ['애니'],
  },
  {
    contentId: 2,
    title: '이웃집 토토로',
    posterUrl: '/images/poster2.webp',
    rating: '전체 관람가',
    genre: ['가족', '힐링'],
    countries: ['일본'],
    platform: ['왓챠'],
    categories: ['애니'],
  },
];

export const mockModalMovieDataList: MovieCardProps[] = [
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
    title: '이웃집 토토로',
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
];
