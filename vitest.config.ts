// Vitest configuration
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['__tests__/setup.ts'],
    exclude: ['node_modules', '__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      threads: false, // Disable threading to prevent OOM on CI
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
      exclude: [
        'node_modules/',
        '__tests__/',
        'dist/',
        'docs/',
        '**/*.d.ts',
        'scripts/',
      ],
    },
    globals: true,
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
});