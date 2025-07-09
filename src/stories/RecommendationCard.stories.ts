import type { Meta, StoryObj } from '@storybook/nextjs';
import RecommendationCard from '@/components/mypage/RecommendationCard';

const meta: Meta<typeof RecommendationCard> = {
  title: 'Mypage/RecommendationCard',
  component: RecommendationCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RecommendationCard>;

export const Default: Story = {
  args: {
    imageUrl: '/movie.webp',
    title: '추천 콘텐츠 보기',
    description: '지금까지 추천 받은 모든 콘텐츠를 한눈에 만나보세요!',
    route: '/recommend',
  },
};
