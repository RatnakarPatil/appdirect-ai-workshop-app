import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
  build: {
    // Exclude test files from build
    rollupOptions: {
      external: ['**/*.test.ts', '**/*.test.tsx', '**/__tests__/**'],
    },
  },
})

