import type { Meta, StoryObj } from '@storybook/nextjs';
import { Ticket } from '@/components/Recommend/Ticket';
import type { TicketComponent } from '@type/recommend/TicketComponent';

const dummyMovie: TicketComponent = {
  contentId: 1,
  title: '쿵푸팬더 4',
  description:
    '용의 전사로 거듭난 포는 평화의 계곡의 영적 지도자가 되라는 명을 받는다. 하지만 새로운 적 카멜레온이 나타나 과거의 모든 악역들을 되살리려 하자, 포는 새로운 동료와 함께 이에 맞서야 한다.',
  posterUrl: '/poster.webp',
  backdropUrl: '/snapshot.webp',
  openDate: '2024년 3월 28일',
  runningTime: 94,
  episode: '1회차',
  rating: '전체관람가',
  category: '애니메이션',
  genres: ['코미디', '액션'],
  directors: ['마이크 미첼'],
  casts: ['잭 블랙', '아콰피나', '더스틴 호프만'],
  platforms: ['넷플릭스', '디즈니+'],
  watchUrls: ['', ''],
};
const meta = {
  title: 'Components/Ticket',
  component: Ticket,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    movie: dummyMovie,
    variant: 'initial', // 기본 variant
    feedback: undefined,
  },
} satisfies Meta<typeof Ticket>;

export default meta;
type Story = StoryObj<typeof meta>;

// 초기 티켓 렌더링 예시
export const Initial: Story = {
  args: {
    variant: 'initial',
  },
};

// 상세 티켓 카드 예시
export const Detail: Story = {
  args: {
    variant: 'detail',
  },
};

export const Result: Story = {
  args: {
    variant: 'result',
  },
};

export const Liked: Story = {
  args: {
    feedback: 'liked',
    variant: 'initial',
  },
};

export const Disliked: Story = {
  args: {
    feedback: 'unliked',
    variant: 'initial',
  },
};
