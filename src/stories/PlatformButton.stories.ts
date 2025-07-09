import type { Meta, StoryObj } from '@storybook/nextjs';
import { PlatformButton } from '@/components/mypage/PlatformButton';

const meta: Meta<typeof PlatformButton> = {
  title: 'Components/PlatformButton',
  component: PlatformButton,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof PlatformButton>;

export const Default: Story = {
  args: {
    platformName: '디즈니+',
    iconUrl: '/disney-plus-icon.png',
    url: 'https://www.disneyplus.com/ko-kr',
  },
};

export const Netflix: Story = {
  args: {
    platformName: '넷플릭스',
    iconUrl: '/disney-plus-icon.png',
    url: 'https://www.netflix.com',
  },
};

export const Watcha: Story = {
  args: {
    platformName: '왓챠',
    iconUrl: '/disney-plus-icon.png',
    url: 'https://watcha.com',
  },
};
