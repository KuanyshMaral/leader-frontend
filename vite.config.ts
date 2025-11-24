import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(), // Этот плагин автоматически подтянет пути из tsconfig.json
  ],
  resolve: {
    alias: {
      // Исправляем пути, используя process.cwd() или просто относительные пути
      '@': path.resolve('./src'),
      '@app': path.resolve('./src/app'),
      '@features': path.resolve('./src/features'),
      '@shared': path.resolve('./src/shared'),
      '@widgets': path.resolve('./src/widgets'),
      '@entities': path.resolve('./src/entities'),
      '@pages': path.resolve('./src/pages'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})