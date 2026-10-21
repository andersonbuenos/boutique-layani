import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    watch: {
      ignored: ['**/DOCS/**', '**/*.zip', '**/node_modules/**'],
    },
  },
  preview: {
    allowedHosts: true,
  },
  test: {
    environment: 'node',
    globals: true,
  },
});


