import {
  chmodSync,
  cpSync,
  existsSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'node:fs';
import babel from '@rolldown/plugin-babel';
import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: ['./src/index.ts', './src/types.ts'],
    outDir: 'dist',
    format: 'esm',
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
    format: 'esm',
    dts: true,
    unbundle: true,
    clean: false,
    platform: 'neutral',
    onSuccess() {
      cpSync('./src/assets/fonts/dist', './dist/fonts', { recursive: true });
      cpSync('./src/assets/images', './dist/images', { recursive: true });
      rmSync('./dist/skills', { recursive: true, force: true });
      cpSync('./.cursor/skills', './dist/skills', { recursive: true });
    }
  },
  {
    entry: {
      'react95-refresh-skills': './scripts/link-agent-skills.ts'
    },
    outDir: 'dist/bin',
    format: 'esm',
    dts: false,
    clean: false,
    platform: 'node',
    fixedExtension: false,
    hash: false,
    minify: false,
    banner: {
      js: '#!/usr/bin/env node'
    },
    onSuccess() {
      const binPath = [
        './dist/bin/react95-refresh-skills.js',
        './dist/bin/react95-refresh-skills.mjs'
      ].find(candidate => existsSync(candidate));
      if (!binPath) {
        throw new Error('Agent skills CLI was not written to dist/bin.');
      }
      const source = readFileSync(binPath, 'utf8');
      if (!source.startsWith('#!')) {
        writeFileSync(binPath, `#!/usr/bin/env node\n${source}`);
      }
      chmodSync(binPath, 0o755);
    }
  }
]);
