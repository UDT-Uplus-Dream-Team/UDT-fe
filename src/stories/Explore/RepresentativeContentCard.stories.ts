import type { Meta, StoryObj } from '@storybook/nextjs';
import { RepresentativeContentCard } from '@/components/explore/RepresentativeContentCard';
import { MovieData } from '@/types/explore/Moviedata';

const meta = {
  title: 'Components/Explore/RepresentativeContentCard',
  component: RepresentativeContentCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '탐색 페이지에서 대표 콘텐츠를 표시하는 큰 카드 컴포넌트입니다. 포스터 이미지, 제목, 장르 태그를 포함하며 호버 효과와 클릭 이벤트를 지원합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    movie: {
      control: 'object',
      description: '표시할 영화 데이터',
    },
    onClick: {
      action: 'clicked',
      description: '카드 클릭 시 호출되는 콜백 함수',
    },
  },
} satisfies Meta<typeof RepresentativeContentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 영화 데이터
const defaultMovie: MovieData = {
  contentId: 1,
  title: '인터스텔라',
  description:
    '우주를 배경으로 한 SF 영화로, 인류의 미래를 위해 새로운 거주지를 찾아 떠나는 우주 탐사대의 이야기를 다룬 작품입니다.',
  posterUrl: '/images/poster1.webp',
  backdropUrl: '/images/poster1.webp',
  openDate: '2014-11-06',
  runtimeTime: 169,
  rating: '12세이상관람가',
  categories: ['SF', '드라마'],
  genres: ['SF', '드라마', '모험', '스릴러'],
  directors: ['크리스토퍼 놀란'],
  platforms: ['넷플릭스', '티빙'],
};

// 1. 기본 상태
export const Default: Story = {
  args: {
    movie: defaultMovie,
    onClick: () => {
      console.log('인터스텔라 카드 클릭됨!');
      alert('인터스텔라 카드가 클릭되었습니다!');
    },
  },
};

// 2. 긴 제목 영화
export const LongTitle: Story = {
  args: {
    movie: {
      ...defaultMovie,
      title: '기생충: 파라사이트 어쩌구 저쩌구 아 집가고싶다',
      genres: ['드라마', '스릴러', '코미디', '가족'],
    },
    onClick: () => {
      console.log('긴 제목 영화 카드 클릭됨!');
      alert('긴 제목 영화 카드가 클릭되었습니다!');
    },
  },
};

// 3. 많은 장르를 가진 영화
export const ManyGenres: Story = {
  args: {
    movie: {
      ...defaultMovie,
      title: '어벤져스: 엔드게임',
      genres: [
        '액션',
        '어드벤처',
        'SF',
        '스릴러',
        '판타지',
        '드라마',
        '코미디',
      ],
    },
    onClick: () => {
      console.log('많은 장르 영화 카드 클릭됨!');
      alert('많은 장르 영화 카드가 클릭되었습니다!');
    },
  },
};

// 7. 다른 포스터 이미지
export const DifferentPoster: Story = {
  args: {
    movie: {
      ...defaultMovie,
      title: '라라랜드',
      posterUrl: '/images/poster2.webp',
      genres: ['뮤지컬', '드라마', '로맨스', '코미디'],
    },
    onClick: () => {
      console.log('라라랜드 카드 클릭됨!');
      alert('라라랜드 카드가 클릭되었습니다!');
    },
  },
};
