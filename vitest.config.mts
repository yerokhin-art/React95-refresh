import path from 'node:path';
import babel from '@rolldown/plugin-babel';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    await babel({
      include: [/src\/.*\.tsx?$/],
      exclude: [/\.spec\.tsx?$/, /\.stories\.tsx?$/],
      plugins: [['babel-plugin-react-compiler', {}]]
    })
  ],
  resolve: {
    alias: {
      react95: path.resolve(import.meta.dirname, './src/index.ts')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup-test.ts'],
    include: ['src/**/*.spec.{ts,tsx}']
  }
});
