import type { Meta, StoryObj } from '@storybook/nextjs';
import { FilterRadioButton } from '@components/explore/FilterRadioButton';

const meta = {
  title: 'Components/FilterRadioButton',
  component: FilterRadioButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '검색 필터나 옵션 선택에서 사용되는 커스텀 라디오 버튼 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: '버튼에 표시될 텍스트 (value로도 사용)',
    },
    isSelected: {
      control: 'boolean',
      description: '선택된 상태',
    },
    onToggle: {
      action: 'toggled',
      description: '토글 시 호출되는 콜백 함수',
    },
  },
} satisfies Meta<typeof FilterRadioButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. 기본 상태
export const Default: Story = {
  args: {
    label: '기본 버튼',
    isSelected: false,
  },
};

// 2. 선택된 상태
export const Selected: Story = {
  args: {
    label: '선택된 버튼',
    isSelected: true,
  },
};
