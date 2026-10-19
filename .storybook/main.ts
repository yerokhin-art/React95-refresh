import path from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';

const storybookConfig: StorybookConfig = {
  stories: ['../docs/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  typescript: {
    reactDocgen: 'react-docgen'
  },
  viteFinal: async config => {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        react95: path.resolve(import.meta.dirname, '../src/index.ts')
      }
    };

    return config;
  }
};

export default storybookConfig;
