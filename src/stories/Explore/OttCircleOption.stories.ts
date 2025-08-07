import type { Meta, StoryObj } from '@storybook/nextjs';
import { OttCircleOption } from '@components/explore/OttCircleOption';
import { PLATFORMS } from '@constants/FilterData';

const meta = {
  title: 'Components/Explore/OttCircleOption',
  component: OttCircleOption,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'OTT 플랫폼을 원형 아이콘으로 표시하는 컴포넌트입니다. 선택 상태에 따라 시각적 피드백을 제공하며, 클릭 시 토글 기능을 지원합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'select',
      options: Object.keys(PLATFORMS),
      description: 'OTT 플랫폼 라벨',
    },
    isSelected: {
      control: 'boolean',
      description: '선택 상태',
    },
    showLabel: {
      control: 'boolean',
      description: '라벨 텍스트 표시 여부, 여기선 기본적으로 false 값으로 설정',
    },
    onToggle: {
      action: 'toggled',
      description: '토글 이벤트 핸들러',
    },
  },
} satisfies Meta<typeof OttCircleOption>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. 기본 상태 (선택되지 않음, 라벨 표시 X)
export const Default: Story = {
  args: {
    label: '넷플릭스',
    isSelected: false,
    showLabel: false,
    onToggle: (label, isSelected) => {
      alert(`${label}가 ${isSelected ? '선택' : '해제'}되었습니다!`);
    },
  },
};

// 2. 선택된 상태
export const Selected: Story = {
  args: {
    label: '넷플릭스',
    isSelected: true,
    showLabel: true,
    onToggle: (label, isSelected) => {
      alert(`${label}가 ${isSelected ? '선택' : '해제'}되었습니다!`);
    },
  },
};
