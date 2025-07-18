import { ContentDetail } from '@type/ContentDetail';
import type { FeedbackContent } from '@type/profile/RecommendedContent';

export const recommendedPosters: FeedbackContent[] = [
  {
    contentId: 1,
    title: '센과 치히로의 행방불명',
    posterUrl: '/images/poster1.webp',
    categories: ['애니', '판타지', '모험'],
  },
  {
    contentId: 2,
    title: '이웃집 토토로',
    posterUrl: '/images/poster2.webp',
    categories: ['애니', '가족', '힐링'],
  },
];

export const mockModalMovieDataList: ContentDetail[] = [
  {
    contentId: 1,
    title: '센과 치히로의 행방불명',
    categories: [
      {
        category: '영화',
        genres: ['애니메이션', '액션'],
      },
    ],
    runningTime: 125,
    openDate: '2001-07-20',
    rating: '전체 관람가',
    description:
      '10살 소녀 치히로가 신비로운 세계에서 부모를 구하고 성장하는 이야기입니다.',
    backdropUrl: '/images/poster1.webp',
    platforms: [
      {
        platformType: '넷플릭스',
        watchUrl: 'https://www.netflix.com/title/example-id',
        isAvailable: true,
      },
      {
        platformType: '디즈니+',
        watchUrl: 'https://www.disneyplus.com/ko-kr/movies/example-id',
        isAvailable: true,
      },
    ],
  },
  {
    contentId: 2,
    title: '이웃집 토토로',
    categories: [
      {
        category: '영화',
        genres: ['애니메이션', '액션'],
      },
    ],
    runningTime: 86,
    openDate: '1988-04-16',
    rating: '전체 관람가',
    description:
      '시골로 이사 온 두 자매가 숲속 생명체 토토로를 만나며 겪는 따뜻한 이야기입니다.',
    backdropUrl: '/images/poster2.webp',
    platforms: [
      {
        platformType: '넷플릭스',
        watchUrl: 'https://www.netflix.com/title/example-id',
        isAvailable: true,
      },
      {
        platformType: '디즈니+',
        watchUrl: 'https://www.disneyplus.com/ko-kr/movies/example-id',
        isAvailable: true,
      },
    ],
  },
];
