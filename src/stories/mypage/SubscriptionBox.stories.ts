import type { Meta, StoryObj } from '@storybook/nextjs';
import SubscriptionBox from '@components/mypage/SubscriptionBox';

const meta: Meta<typeof SubscriptionBox> = {
  title: 'Mypage/SubscriptionBox',
  component: SubscriptionBox,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SubscriptionBox>;

export const OTT구독현황: Story = {
  args: {
    title: 'OTT 구독 현황',
    items: ['Netflix', 'Tving+', 'Wavve'],
  },
};

export const 선호장르: Story = {
  args: {
    title: '선호 장르',
    items: ['#드라마', '#범죄', '#로맨스'],
  },
};
