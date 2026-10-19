import type { Decorator, Parameters } from '@storybook/react-vite';
import { withGlobalStyle } from './decorators/withGlobalStyle';
import { withThemesProvider } from './theme-picker/ThemeProvider';

export const initialGlobals = {
  theme: 'original'
};

export const decorators: Decorator[] = [withGlobalStyle, withThemesProvider];

export const parameters: Parameters = {
  layout: 'fullscreen',
  options: {
    storySort: {
      order: [
        'Docs',
        [
          'Welcome to React95',
          'Getting Started',
          'Contributing',
          'Submit your Project'
        ],
        'Controls',
        'Environment',
        'Layout',
        'Typography',
        'Other'
      ]
    }
  }
};
