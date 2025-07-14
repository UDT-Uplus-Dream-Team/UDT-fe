import { UserInfo } from '@type/UserInfo';

// 추천 데이터 보러가기 고정값
export const recommendData = [
  {
    imageUrl: '/movie.webp',
    title: '맞춤형 추천 콘텐츠 보기',
    description: '지금까지 추천 받은 맞춤형 콘텐츠를 만나보세요!',
    route: '/profile/recommend',
  },
  {
    imageUrl: '/images/poster4.webp',
    title: '나의 취향 확인하기',
    description: '좋아요 싫어요 나의 취향을 확인해보세요!',
    route: '/profile/feedbacks',
  },
];

// api 연동 시 없엘 테스트용
export const mockUserProfile: UserInfo = {
  name: '테스트',
  email: 'udt@udt.com',
  platforms: ['넷플릭스', '왓챠'],
  genres: ['액션', '코미디', '로맨스', '공포'],
};
