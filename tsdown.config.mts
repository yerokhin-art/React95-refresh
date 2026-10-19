import { cpSync } from 'node:fs';
import babel from '@rolldown/plugin-babel';
import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: ['./src/index.ts', './src/types.ts'],
    outDir: 'dist',
    format: ['cjs', 'esm'],
    dts: true,
    unbundle: true,
    clean: true,
    platform: 'neutral',
    plugins: [
      await babel({
        include: [/\.tsx?$/],
        plugins: [['babel-plugin-react-compiler', {}]]
      })
    ]
  },
  {
    entry: ['./src/common/themes/*.ts'],
    outDir: 'dist/themes',
    format: ['cjs', 'esm'],
    dts: true,
    unbundle: true,
    clean: false,
    platform: 'neutral',
    onSuccess() {
      cpSync('./src/assets/fonts/dist', './dist/fonts', { recursive: true });
      cpSync('./src/assets/images', './dist/images', { recursive: true });
    }
  }
]);
