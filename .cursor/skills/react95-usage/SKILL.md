---
name: react95-usage
description: Build Windows 95 UI interfaces using the installed react95-refresh component library and styled-components v6. Use when importing from react95-refresh, configuring themes or GlobalStyles, composing Windows 95 windows/forms/menus/tables, or checking component props and event callbacks.
---

# Using `react95-refresh` (Consumer Guide)

## 1. Package Entry Points

| Import Path | Exports |
|---|---|
| `react95-refresh` | All UI components, `styleReset`, `createScrollbars`, component `*Props` types, `Styled*` primitives |
| `react95-refresh/themes/<name>` | Single theme object (tree-shakeable, recommended, e.g. `react95-refresh/themes/original`) |
| `react95-refresh/themes` | Default export containing all 60 themes (`themes.original`, `themes.tokyoDark`, etc.) |
| `react95-refresh/types` | Shared TypeScript types (`Theme`, `WindowsTheme`, `Sizes`, `Orientation`, `CommonStyledProps`) |
| `react95-refresh/fonts/*` | `ms_sans_serif.woff2`, `ms_sans_serif_bold.woff2` (also `.woff`) |

## 2. Installation & App Setup

### Peer Dependencies & Install
Requires `react >= 19.0.0`, `react-dom >= 19.0.0`, and `styled-components >= 6.0.0`.
```sh
pnpm add react95-refresh styled-components
```

### Provider, Global Styles & Fonts (`styled-components` v6)
Every app using `react95-refresh` **must** wrap its tree in `<ThemeProvider theme={...}>` from `styled-components` (otherwise components throw on `theme.*` access). For Next.js App Router / SSR, mark the provider wrapper with `'use client'`.

```tsx
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { createScrollbars, styleReset } from 'react95-refresh';
import original from 'react95-refresh/themes/original';
import ms_sans_serif from 'react95-refresh/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95-refresh/fonts/ms_sans_serif_bold.woff2';

const GlobalStyles = createGlobalStyle`
  ${styleReset}
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif}') format('woff2');
    font-weight: 400;
    font-style: normal;
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif_bold}') format('woff2');
    font-weight: bold;
    font-style: normal;
  }
  body, input, select, textarea {
    font-family: 'ms_sans_serif';
  }
  ${createScrollbars('default')}
`;

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GlobalStyles />
      <ThemeProvider theme={original}>{children}</ThemeProvider>
    </>
  );
}
```

### TypeScript Declarations (`src/styled.d.ts`)
Add module declarations if TypeScript reports missing `.woff2` module types or untyped `theme` in custom `styled` components:
```ts
import 'styled-components';
import type { Theme } from 'react95-refresh/types';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

declare module '*.woff2' {
  const src: string;
  export default src;
}
```

## 3. Critical Callback Signatures (Do Not Guess)

Several components use custom callback signatures instead of native `React.ChangeEvent`:

| Component | Callback Prop & Exact Signature |
|---|---|
| `NumberInput` | `onChange?: (value: number) => void` |
| `Slider` | `onChange?: (value: number) => void`, `onChangeCommitted?: (value: number) => void` |
| `Select<T>` | `onChange?: (selectedOption: SelectOption<T>, meta: { fromEvent: Event \| React.SyntheticEvent }) => void` |
| `SelectNative` | `onChange?: (selectedOption: SelectOption<string>, meta: { fromEvent: Event \| React.SyntheticEvent }) => void` |
| `Tabs` | `onChange?: (value: any, event: React.MouseEvent<HTMLButtonElement>) => void` |
| `Tab` | `onClick?: (value: any, event: React.MouseEvent<HTMLButtonElement>) => void` |
| `TreeView<T>` | `onNodeSelect?: (event: React.MouseEvent<HTMLElement>, id: T) => void`<br>`onNodeToggle?: (event: React.MouseEvent<HTMLElement>, expandedIds: T[]) => void` |
| `DatePicker__UNSTABLE` | `onAccept?: (chosenDate: string) => void` (`'YYYY-MM-DD'`), `onCancel?: React.MouseEventHandler<HTMLButtonElement>` |
| `TextInput`, `Checkbox`, `Radio`, `ColorInput` | Standard `React.ChangeEventHandler<HTMLInputElement>` (`HTMLTextAreaElement` when `TextInput` has `multiline`) |

## 4. Component Quick Index

All components support `ref` forwarding and polymorphic `as?: string | ComponentType<any>` (except `Monitor`, `DatePicker__UNSTABLE`, `Toolbar`, `TableRow`, `SelectNative`). Standard control heights (`Sizes`): `'sm'` (28px), `'md'` (36px), `'lg'` (44px).

- **Surfaces & Layout**: `Window` (`WindowHeader`, `WindowContent`), `Frame` (`variant?: 'window' | 'button' | 'field' | 'status'`), `ScrollView`, `GroupBox`, `Separator`, `Handle`, `Monitor`
- **Navigation & Bars**: `AppBar`, `Toolbar`, `MenuList` (`MenuListItem`), `Tabs` (`Tab`, `TabBody`)
- **Inputs & Forms**: `Button`, `TextInput`, `NumberInput`, `Select`, `SelectNative`, `Checkbox`, `Radio`, `Slider`, `ColorInput`, `DatePicker__UNSTABLE`
- **Data & Feedback**: `Table` (`TableHead`, `TableBody`, `TableRow`, `TableHeadCell`, `TableDataCell`), `TreeView`, `ProgressBar`, `Counter`, `Avatar`, `Tooltip`, `Hourglass`, `Anchor`

## 5. Deprecated Exports & Prop Variants (Never Use)

| Deprecated | Use Instead |
|---|---|
| `Bar` | `Handle` |
| `Cutout` | `ScrollView` |
| `Desktop` | `Monitor` |
| `Divider` | `Separator` |
| `Fieldset` | `GroupBox` |
| `List`, `ListItem` | `MenuList`, `MenuListItem` |
| `NumberField` | `NumberInput` |
| `Panel` | `Frame` |
| `Progress` | `ProgressBar` |
| `TextField` | `TextInput` |
| `Tree` | `TreeView` |
| `<Button variant='menu'>` | `<Button variant='thin'>` |
| `<Frame variant='outside' \| 'inside' \| 'well'>` | `<Frame variant='window' \| 'button' \| 'field' \| 'status'>` |
| `<AppBar fixed={false}>` | `<AppBar position='absolute'>` (or `'static' \| 'relative' \| 'sticky'`) |
| `<Select labelId='...'>` | `<Select aria-labelledby='...'>` |

## 6. Progressive Reference Files

Read these files only when you need detailed component props/examples or theme tokens:
- **Full component props, sub-components & JSX examples**: [components.md](components.md)
- **All 60 theme names, `Theme` color tokens & styling utilities**: [themes-and-styling.md](themes-and-styling.md)
