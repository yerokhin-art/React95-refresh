# Themes & Styling Reference (`react95-refresh`)

## 1. Importing Themes

### Single Theme Import (Recommended, Tree-Shakeable)
```tsx
import original from 'react95-refresh/themes/original';
import tokyoDark from 'react95-refresh/themes/tokyoDark';
```

### All 60 Available Themes
`aiee`, `ash`, `azureOrange`, `bee`, `blackAndWhite`, `blue`, `brick`, `candy`, `cherry`, `coldGray`, `counterStrike`, `darkTeal`, `denim`, `eggplant`, `fxDev`, `highContrast`, `honey`, `hotChocolate`, `hotdogStand`, `lilac`, `lilacRoseDark`, `maple`, `marine`, `matrix`, `millenium`, `modernDark`, `molecule`, `ninjaTurtles`, `olive`, `original`, `pamelaAnderson`, `peggysPastels`, `plum`, `polarized`, `powerShell`, `rainyDay`, `raspberry`, `redWine`, `rose`, `seawater`, `shelbiTeal`, `slate`, `solarizedDark`, `solarizedLight`, `spruce`, `stormClouds`, `theSixtiesUSA`, `tokyoDark`, `toner`, `tooSexy`, `travel`, `vaporTeal`, `vermillion`, `violetDark`, `vistaesqueMidnight`, `water`, `white`, `windows1`, `wmii`.

### Theme Picker Pattern
When building a dynamic theme switcher, import the barrel object:
```tsx
import themes from 'react95-refresh/themes';
// themes is Record<string, Theme>
```

---

## 2. `Theme` Object Tokens (`styled-components`)

When writing custom `styled` components in a consumer project, access `theme` tokens via `${({ theme }) => theme.<token>}`.

To type `styled-components` `DefaultTheme` in a consumer project (`styled.d.ts`):
```ts
import 'styled-components';
import type { Theme } from 'react95-refresh/dist/types';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
```

### All 30 Semantic Tokens on `Theme`
- **Metadata**: `name` (`string`)
- **Surfaces (Windows/Buttons)**: `material`, `materialDark`, `materialText`, `materialTextInvert`, `materialTextDisabled`, `materialTextDisabledShadow`
- **Recessed Fields / Inputs / Tables**: `canvas`, `canvasText`, `canvasTextInvert`, `canvasTextDisabled`, `canvasTextDisabledShadow`
- **3D Bevel Borders**: `borderLightest` (top-left highlight), `borderLight`, `borderDark` (bottom-right shadow), `borderDarkest` (outermost dark edge)
- **Flat Variant Borders/Surfaces**: `flatLight`, `flatDark`
- **Window Title Bar**: `headerBackground`, `headerText`, `headerNotActiveBackground`, `headerNotActiveText`
- **Interactive / Selection**: `hoverBackground`, `focusSecondary`, `checkmark`, `checkmarkDisabled`
- **Misc**: `desktopBackground`, `progress`, `tooltip`, `anchor`, `anchorVisited`

---

## 3. Public Styling Utilities (`react95-refresh`)

- **`styleReset`**: CSS string resetting browser defaults, list styles, tables, and number input spin buttons. Interpolate inside `createGlobalStyle`.
- **`createScrollbars(variant?: 'default' | 'flat')`**: `styled-components` `css` helper generating Windows 95 `::-webkit-scrollbar` styles with SVG arrow buttons and hatched tracks. Can be applied globally in `createGlobalStyle` or on a specific scrollable `styled.div`.
- **Exported Styled Primitives**:
  - `StyledButton` (from `Button`)
  - `StyledScrollView` (from `ScrollView`)
  - `StyledMenuListItem` (from `MenuList`)
  - `StyledColorInput` (from `ColorInput`)
- **Exported Shared Types (`from 'react95-refresh/dist/types'`)**:
  - `Theme`, `WindowsTheme`, `Color`
  - `Sizes` (`'sm' | 'md' | 'lg'`), `Orientation` (`'horizontal' | 'vertical'`), `Direction` (`'up' | 'down' | 'left' | 'right'`), `DimensionValue` (`undefined | number | string`), `CommonStyledProps`, `CommonThemeProps`
