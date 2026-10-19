<h1 align="center">React95 Refresh</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/react95-refresh"><img src="https://flat.badgen.net/npm/v/react95-refresh" alt="react95-refresh version" /></a>
  <a href="https://www.npmjs.com/package/react95-refresh"><img src="https://flat.badgen.net/npm/license/react95-refresh" alt="react95-refresh license" /></a>
</p>

<p align="center">
  <b>Refreshed</b> Windows 95 UI components for modern React 19 apps.<br />
  Built with <a href="https://styled-components.com/">styled-components v6</a> 💅 &amp; pre-compiled with <b>React Compiler</b> ⚡
</p>

![hero](https://user-images.githubusercontent.com/28541613/81947711-28b05580-9601-11ea-964a-c3a6de998496.png)

## About This Fork

**React95 Refresh** (`react95-refresh`) is a modernized, actively maintained fork of the original [React95](https://github.com/arturbien/React95) library created by [Artur Bień](https://github.com/arturbien), with a complete refresh of all dependencies, build tooling, and internal architecture:

- **React 19 + React Compiler** — Full support for React 19, native `React.useId`, removal of legacy `findDOMNode`, and pre-compiled bundle output via `babel-plugin-react-compiler`.
- **styled-components v6** — Migrated to v6 with proper transient (`$`) props and `shouldForwardProp` filtering (zero React DOM attribute warnings).
- **TypeScript 7** — Strict type definitions with modern ESM (`*.d.mts`) and CJS (`*.d.ts`) package `exports`.
- **Rolldown (`tsdown`)** — Ultra-fast ESM + CJS builds powered by Rolldown.
- **Vitest 5 & Vite 8** — Modernized test runner and Storybook 10 (`@storybook/react-vite`) environment.
- **Biome** — Unified, fast linting and code formatting.

## Getting Started

First, install the component library and `styled-components` in your project directory:

```sh
# pnpm
pnpm add react95-refresh styled-components

# npm
npm install react95-refresh styled-components

# yarn
yarn add react95-refresh styled-components
```

Apply `styleReset`, wrap your app with `ThemeProvider` using a theme of your choice, and you are ready to go! 🚀

```tsx
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { MenuList, MenuListItem, Separator, styleReset } from 'react95-refresh';
// pick a theme of your choice
import original from 'react95-refresh/themes/original';
// original Windows95 font (optional)
import ms_sans_serif from 'react95-refresh/dist/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95-refresh/dist/fonts/ms_sans_serif_bold.woff2';

const GlobalStyles = createGlobalStyle`
  ${styleReset}
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif}') format('woff2');
    font-weight: 400;
    font-style: normal
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif_bold}') format('woff2');
    font-weight: bold;
    font-style: normal
  }
  body {
    font-family: 'ms_sans_serif';
  }
`;

const App = () => (
  <div>
    <GlobalStyles />
    <ThemeProvider theme={original}>
      <MenuList>
        <MenuListItem>🎤 Sing</MenuListItem>
        <MenuListItem>💃🏻 Dance</MenuListItem>
        <Separator />
        <MenuListItem disabled>😴 Sleep</MenuListItem>
      </MenuList>
    </ThemeProvider>
  </div>
);

export default App;
```

## Contributing

Feel free to open pull requests and submit issues or component proposals in [yerokhin-art/React95-refresh](https://github.com/yerokhin-art/React95-refresh). Let's keep this retro UI alive in the modern React ecosystem! ♥️

## License

MIT © [Artur Bień](https://github.com/arturbien) (Original Author) & [Artur Yerokhin](https://github.com/yerokhin-art) (Fork Maintainer & Modifications)
