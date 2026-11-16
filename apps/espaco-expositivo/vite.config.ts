import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Configuração única de build (Vite) e testes (Vitest) do aplicativo.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    restoreMocks: true,
  },
});
