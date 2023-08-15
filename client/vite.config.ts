import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const API_URL = mode === 'production' ? 'https://rolling-chat-messenger-server.vercel.app/' : 'http://localhost:5000';
  console.log('mode', mode)

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
