/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const API_URL = mode === 'production' ? 'https://rolling-backend.onrender.com' : 'http://localhost:5000'

  console.log('mode', mode)
  console.log('API_URL', API_URL)
  return {
    plugins: [react()],
    preview: {
      host: true,
      port: 3000,
    },
    server: {
      port: 3000,
      open: true,
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
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/setupTests.ts']
    },
    eslint: {
      configFile: '.eslintrc.cjs',
    }
  }
})
