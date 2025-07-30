import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/nextjs';
import { CircleOption } from '@/components/common/circleOption';
import { CheckCircle } from 'lucide-react'; // shadcn 아이콘 예시

const meta: Meta<typeof CircleOption> = {
  title: 'Components/CircleOption',
  component: CircleOption,
  args: {
    imageSrc: '/images/ott/netflix.webp',
    label: '넷플릭스',
    size: 'default',
    selected: false,
    showLabel: true,
  },
};

export default meta;
type Story = StoryObj<typeof CircleOption>;

// 기본 형태
export const Default: Story = {
  render: (args) => (
    <div className="p-10 bg-gray-900 flex justify-center">
      <CircleOption {...args} />
    </div>
  ),
  args: {
    selected: false,
  },
};

// 선택된 상태 (기본 ✔ 오버레이)
export const Selected: Story = {
  render: (args) => (
    <div className="p-10 bg-gray-900 flex justify-center">
      <CircleOption {...args} />
    </div>
  ),
  args: {
    selected: true,
  },
};

// 라벨 숨긴 버전
export const NoLabel: Story = {
  render: (args) => (
    <div className="p-10 bg-gray-900 flex justify-center">
      <CircleOption {...args} />
    </div>
  ),
  args: {
    showLabel: false,
    selected: true,
  },
};

// 커스터마이징된 selectedOverlay
export const CustomOverlay: Story = {
  render: (args) => (
    <div className="p-10 bg-gray-900 flex justify-center">
      <CircleOption {...args} />
    </div>
  ),
  args: {
    selected: true,
    selectedOverlay: <CheckCircle className="w-6 h-6 text-green-400" />,
  },
};

// 다양한 사이즈
export const Sizes: Story = {
  render: () => (
    <div className="p-10 bg-gray-900 flex justify-center gap-4">
      <CircleOption
        imageSrc="/images/ott/netflix.webp"
        label="XS"
        size="xs"
        onClick={() => {}}
      />
      <CircleOption
        imageSrc="/images/ott/netflix.webp"
        label="SM"
        size="sm"
        onClick={() => {}}
      />
      <CircleOption
        imageSrc="/images/ott/netflix.webp"
        label="MD"
        size="md"
        onClick={() => {}}
      />
      <CircleOption
        imageSrc="/images/ott/netflix.webp"
        label="LG"
        size="default"
        onClick={() => {}}
      />
    </div>
  ),
};

// 상태 변화 예시 (선택 토글)
export const ToggleSelection: Story = {
  render: () => {
    const [selected, setSelected] = useState(false);

    return (
      <CircleOption
        imageSrc="/images/ott/netflix.webp"
        label="토글 예시"
        selected={selected}
        onClick={() => setSelected((prev) => !prev)}
      />
    );
  },
};
