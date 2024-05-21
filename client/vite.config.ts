/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const API_URL = mode === 'production' ? 'https://rolling-backend.onrender.com' : 'http://localhost:5000'

  return {
    plugins: [react()],
    preview: {
      port: 3000,
    },
    server: {
      open: false,
      host: true,
      port: 3000,
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
    eslint: {
      configFile: '.eslintrc.cjs',
    }
  }
})
