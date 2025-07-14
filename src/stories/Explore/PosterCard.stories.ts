import type { Meta, StoryObj } from '@storybook/nextjs';
import { PosterCard } from '@/components/explore/PosterCard';

const meta = {
  title: 'Components/Explore/PosterCard',
  component: PosterCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '포스터 이미지와 제목을 표시하는 카드 컴포넌트입니다. 클릭 시 상세 페이지로 이동하는 기능을 제공합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: '포스터의 제목',
    },
    image: {
      control: 'text',
      description: '포스터 이미지 URL',
    },
    isTitleVisible: {
      control: 'boolean',
      description: '제목 표시 여부',
    },
    onClick: {
      action: 'clicked',
      description: '카드 클릭 시 호출되는 콜백 함수',
    },
  },
} satisfies Meta<typeof PosterCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. 기본 상태 (제목 표시)
export const Default: Story = {
  args: {
    title: '귀를 기울이면',
    image: '/images/poster1.webp',
    isTitleVisible: true,
    onClick: () => {
      console.log('귀를 기울이면 포스터 클릭됨!');
      alert('귀를 기울이면 포스터가 클릭되었습니다!');
    },
  },
};

// 2. 제목 숨김 상태
export const HiddenTitle: Story = {
  args: {
    title: '고양이의 보은',
    image: '/images/poster2.webp',
    isTitleVisible: false,
    onClick: () => {
      console.log('고양이의 보은 포스터 클릭됨! (제목 숨김)');
      alert('고양이의 보은 포스터가 클릭되었습니다!');
    },
  },
};

// 3. 긴 제목
export const LongTitle: Story = {
  args: {
    title: '벼랑 위의 포뇨 어쩌구 저쩌구 아 집가고싶다',
    image: '/images/poster3.webp',
    isTitleVisible: true,
    onClick: () => {
      console.log('긴 제목 포스터 클릭됨!');
      alert('긴 제목 포스터가 클릭되었습니다!');
    },
  },
};
