import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  const API_URL = process.env.NODE_ENV === 'production' ? 'https://rolling-948m.onrender.com/' : 'http://localhost:5000';

  return {
    plugins: [react()],
    preview: {
      host: true,
      port: 3000,
    },
    server: {
      port: 3000,
      host: true,
      strictPort: true,
      watch: {
        usePolling: true,
      },
      proxy: {
        '/api': {
          target: API_URL,
          changeOrigin: true,
        },
      },
    },
  };
});
