import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Vite Configuration
 *
 * @vitejs/plugin-react  – enables JSX transform and React Fast Refresh (HMR)
 *
 * server.proxy – forwards /api/* requests from the Vite dev server (port 5173)
 *                to the Spring Boot backend (port 8080).
 *                This avoids CORS issues during development.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
