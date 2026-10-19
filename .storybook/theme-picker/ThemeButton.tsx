import { useCallback } from 'react';
import { ThemeProvider } from 'styled-components';
import { Button } from '../../src/Button/Button';
import type { Theme } from '../../src/types';

export function ThemeButton({
  active,
  onChoose,
  theme
}: {
  active: boolean;
  onChoose: (themeName: string) => void;
  theme: Theme;
}) {
  const handleClick = useCallback(() => {
    onChoose(theme.name);
  }, [onChoose, theme.name]);

  return (
    <ThemeProvider theme={theme}>
      <Button active={active} onClick={handleClick}>
        {theme.name}
      </Button>
    </ThemeProvider>
  );
}
