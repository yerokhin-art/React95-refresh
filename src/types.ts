import type { ComponentType } from 'react';

import type { Color, Theme, WindowsTheme } from './common/themes/types';

export type Sizes = 'sm' | 'md' | 'lg';

export type Orientation = 'horizontal' | 'vertical';

export type Direction = 'up' | 'down' | 'left' | 'right';

export type DimensionValue = undefined | number | string;

export type CommonStyledProps = {
  /**
   * "as" polymorphic prop allows to render a different HTML element or React component
   * @see {@link https://styled-components.com/docs/api#as-polymorphic-prop}
   */
  as?: string | ComponentType<any>;
};

export type HTMLDataAttributes = Record<`data-${string}`, any>;

export type CommonThemeProps = {
  children?: unknown;
  'data-testid'?: string;
  $disabled?: boolean;
  $shadow?: boolean;
  shadow?: boolean;
};

export type { Color, Theme, WindowsTheme };
