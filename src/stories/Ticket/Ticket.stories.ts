import type { Meta, StoryObj } from '@storybook/nextjs';
import { Ticket } from '@components/Ticket/Ticket';
import type { MovieData } from '@type/Moviedata';

const dummyMovie: MovieData = {
  // MovieData 타입 정의에 맞게 필드 채워주세요
  contentId: 1,
  title: '인셉션',
  posterUrl: 'poster.webp',
  backdropUrl: 'snapshot.webp',
  directors: ['크리스토퍼 놀란'],
  categories: ['액션', 'SF'],
  genres: ['액션', '스릴러', 'SF', '미스터리'],
  rating: '12세 관람가',
  openDate: '2010-07-16',
  runtimeTime: 148,
  description:
    '꿈을 매개로 의식을 조작하는 팀이 마지막 미션을 수행하는 과정을 그린 크리스토퍼 놀란 감독의 대표작.꿈을 매개로 의식을 조작하는 팀이 마지막 미션을 수행하는 과정을 그린 크리스토퍼 놀란 감독의 대표작.',
  platforms: ['Netflix', 'Amazon Prime', 'Disney+'],
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
