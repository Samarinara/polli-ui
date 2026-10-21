import {defineConfig} from 'vitest/config';
export default defineConfig({test:{environment:'jsdom',maxWorkers:1,pool:'threads',testTimeout:15_000,setupFiles:['./scripts/test-setup.ts'],include:['packages/ui/tests/**/*.test.tsx']}});
