import { defineConfig } from 'tsup';
export default defineConfig({
  entry: ['src/index.ts', 'src/theme.tsx', 'src/components/*.tsx', 'src/tokens.ts', 'src/web/index.ts', 'src/web/components/*.tsx', 'src/web/lib/utils.ts'],
  format: ['esm'], dts: true, sourcemap: true, clean: true,
  external: ['react', 'react-dom', 'react/jsx-runtime', 'react-native', 'react-native-web', 'react-native-svg'],
  banner: { js: '"use client";' },
});
