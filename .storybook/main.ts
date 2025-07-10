import type { StorybookConfig } from '@storybook/nextjs';
import path from 'path';
import { fileURLToPath } from 'url'; // Windows와 Unix에서 파일 경로 처리를 위해 추가

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|js|jsx)', '../src/**/*.mdx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-onboarding'],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: [path.join(dirname, '..', 'public')],
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '..', 'src'),
        '@components': path.resolve(__dirname, '..', 'src', 'components'),
        '@app': path.resolve(__dirname, '..', 'src', 'app'),
        '@ui': path.resolve(__dirname, '..', 'src', 'components', 'ui'),
        '@hooks': path.resolve(__dirname, '..', 'src', 'hooks'),
        '@lib': path.resolve(__dirname, '..', 'src', 'lib'),
        '@utils': path.resolve(__dirname, '..', 'src', 'utils'),
        '@type': path.resolve(__dirname, '..', 'src', 'types'),
        '@styles': path.resolve(__dirname, '..', 'src', 'styles'),
      };
    }
    return config;
  },
};
export default config;
