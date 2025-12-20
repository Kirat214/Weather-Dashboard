
// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/__tests__/**',
        'src/**/*.d.ts',
        'src/vite-env.d.ts',
        'src/main.tsx',
      ],

      // ✅ Coverage gates — Vitest v1+ expects them under `thresholds`
      // (If you're on an older version and this doesn't work, see Option 2)
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },

      // Optional: include files not hit by tests to compute coverage more honestly
      // Note: the 'all' option is not supported by the 'v8' coverage provider's types, so it has been removed.
    },
  },
});
