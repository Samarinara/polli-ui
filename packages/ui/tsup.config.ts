import { defineConfig } from 'tsup';
export default defineConfig({ entry: ['src/index.ts', 'src/components/*.tsx', 'src/tokens.ts', 'src/lib/utils.ts'], format: ['esm'], dts: true, sourcemap: true, clean: true, external: ['react','react-dom','react/jsx-runtime'], banner: { js: '"use client";' } });
