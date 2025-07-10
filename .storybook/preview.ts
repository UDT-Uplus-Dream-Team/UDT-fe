import type { Preview } from '@storybook/nextjs';
import '@app/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      backgrounds: {
        default: 'dark',
        values: [
          { name: 'dark', value: '#121212' },
          { name: 'light', value: '#ffffff' }, // 필요 시 다른 테마도 추가 가능
        ],
      },
    },
  },
};

export default preview;
