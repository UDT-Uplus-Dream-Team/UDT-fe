import type { Meta, StoryObj } from '@storybook/nextjs';
import { SurveyPosterCard } from '@components/survey/SurveyPosterCard';

const meta = {
  title: 'Components/SurveyPosterCard',
  component: SurveyPosterCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '설문 조사 시 사용되는 포스터 카드 컴포넌트입니다. 선택된 항목은 테두리와 확대 효과로 표시됩니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: '포스터의 제목 (alt용)',
    },
    image: {
      control: 'text',
      description: '포스터 이미지 URL',
    },
    selected: {
      control: 'boolean',
      description: '선택 여부에 따른 스타일 변화',
    },
    onClick: {
      action: 'clicked',
      description: '카드 클릭 시 호출되는 콜백 함수',
    },
  },
} satisfies Meta<typeof SurveyPosterCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: '귀를 기울이면',
    image: '/images/poster1.webp',
    selected: false,
    onClick: () => alert('귀를 기울이면 선택됨!'),
  },
};

export const Selected: Story = {
  args: {
    title: '고양이의 보은',
    image: '/images/poster2.webp',
    selected: true,
    onClick: () => alert('고양이의 보은 선택됨!'),
  },
};

export const LongTitleSelected: Story = {
  args: {
    title: '벼랑 위의 포뇨',
    image: '/images/poster3.webp',
    selected: true,
    onClick: () => alert('포뇨포뇨 선택됨!'),
  },
};
