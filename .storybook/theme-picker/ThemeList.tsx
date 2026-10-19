import { useCallback } from 'react';
import { useGlobals } from 'storybook/manager-api';
import styled from 'styled-components';

import themes from '../../src/common/themes';
import type { Theme } from '../../src/types';
import { THEMES_ID } from './constants';
import { ThemeButton } from './ThemeButton';

const {
  original,
  rainyDay,
  vaporTeal,
  theSixtiesUSA,
  olive,
  tokyoDark,
  rose,
  plum,
  matrix,
  travel,
  ...otherThemes
} = themes;

const themeList = [
  original,
  rainyDay,
  vaporTeal,
  theSixtiesUSA,
  olive,
  tokyoDark,
  rose,
  plum,
  matrix,
  travel,
  ...Object.values(otherThemes)
];

type ThemesProps = {
  active?: boolean;
};

const Wrapper = styled.div<{ theme: Theme }>`
  display: grid;
  padding: 1em;
  gap: 1em;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  grid-template-rows: repeat(auto-fill, 40px);
  background-color: ${({ theme }) => theme.material};
`;

export function ThemeList({ active }: ThemesProps) {
  const [globals, updateGlobals] = useGlobals();
  const themeName = (globals.theme as string) || 'original';

  const handleChoose = useCallback(
    (newThemeName: string) => {
      updateGlobals({ theme: newThemeName });
    },
    [updateGlobals]
  );

  if (!active) {
    return null;
  }

  return (
    <Wrapper key={THEMES_ID} theme={themes.original}>
      {themeList.map(theme => (
        <ThemeButton
          active={themeName === theme.name}
          key={theme.name}
          onChoose={handleChoose}
          theme={theme}
        />
      ))}
    </Wrapper>
  );
}
