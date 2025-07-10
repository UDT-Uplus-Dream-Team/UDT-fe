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
        '@': path.resolve(dirname, '..', 'src'),
        '@components': path.resolve(dirname, '..', 'src', 'components'),
        '@app': path.resolve(dirname, '..', 'src', 'app'),
        '@ui': path.resolve(dirname, '..', 'src', 'components', 'ui'),
        '@hooks': path.resolve(dirname, '..', 'src', 'hooks'),
        '@lib': path.resolve(dirname, '..', 'src', 'lib'),
        '@utils': path.resolve(dirname, '..', 'src', 'utils'),
        '@type': path.resolve(dirname, '..', 'src', 'types'),
        '@styles': path.resolve(dirname, '..', 'src', 'styles'),
      };
    }
    return config;
  },
};
export default config;
