import storybook from 'eslint-plugin-storybook';
import globals from 'globals';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptEslintParser from '@typescript-eslint/parser';
import nextPlugin from '@next/eslint-plugin-next';
import prettierConfig from 'eslint-config-prettier';

/** @type {import("eslint").ESLint.FlatConfigArray} */
const eslintConfig = [
  {
    ignores: ['node_modules/', '.next/', 'public/'],
  },

  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        React: 'readonly', // React 17+ JSX Transform 지원
      },
    },
  },

  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['.storybook/**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
    },
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...typescriptEslintPlugin.configs.recommended.rules,
    },
  },

  {
    files: ['.storybook/**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
    },
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        project: ['.storybook/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...typescriptEslintPlugin.configs.recommended.rules,
    },
  },

  prettierConfig,

  ...storybook.configs['flat/recommended'],
];

export default eslintConfig;