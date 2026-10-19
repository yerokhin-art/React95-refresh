import type { Decorator } from '@storybook/react-vite';
import { ThemeProvider } from 'styled-components';

import themes from '../../src/common/themes/index';

export const withThemesProvider: Decorator = (story, context) => {
  const themeName =
    (context.globals.theme as keyof typeof themes) || 'original';

  return (
    <ThemeProvider theme={themes[themeName] ?? themes.original}>
      {story()}
    </ThemeProvider>
  );
};
